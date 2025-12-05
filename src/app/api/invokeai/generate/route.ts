// src/app/api/invokeai/generate/route.ts
// Local API route to generate images using InvokeAI's queue-based workflow system
// This bypasses Firebase Functions and connects directly to local InvokeAI server

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// InvokeAI queue ID (default is usually "default")
const QUEUE_ID = 'default';

// Helper to build InvokeAI graph for text-to-image generation
// Based on working workflow structure from InvokeAI UI
// TypeScript interfaces for InvokeAI API responses
interface InvokeAIModel {
  id: string;
  name: string;
  base: string;
  type?: string;
  [key: string]: unknown;
}

interface GraphNode {
  id: string;
  type: string;
  is_intermediate?: boolean;
  use_cache?: boolean;
  [key: string]: unknown;
}

interface QueueStatus {
  completed: number;
  failed: number;
  canceled: number;
  pending?: number;
  in_progress?: number;
  [key: string]: unknown;
}

// Helper to fetch available models
async function fetchModels(endpoint: string): Promise<InvokeAIModel[]> {
  try {
    const response = await fetch(`${endpoint}/api/v2/models/?model_type=main`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}

// Helper to build InvokeAI graph for text-to-image generation
// Based on working workflow structure from InvokeAI UI
function buildInvokeAIGraph(params: {
  prompt: string;
  model: InvokeAIModel; // Full model object
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  seed?: number;
}) {
  const {
    prompt,
    model,
    steps = 30,
    cfg_scale = 7.5,
    width = 512,
    height = 512,
    seed,
  } = params;

  // Generate random seed if not provided
  const finalSeed = seed ?? Math.floor(Math.random() * 2147483647);

  // Build nodes - structure based on working InvokeAI workflow
  const nodes: Record<string, GraphNode> = {
    // Seed value
    'seed': {
      id: 'seed',
      type: 'integer',
      is_intermediate: true,
      use_cache: true,
      value: finalSeed,
    },
    // Positive prompt
    'positive_prompt': {
      id: 'positive_prompt',
      type: 'string',
      is_intermediate: true,
      use_cache: true,
      value: prompt,
    },
    // Model loader - use first available model if not specified
    'model_loader': {
      id: 'model_loader',
      type: 'main_model_loader',
      is_intermediate: true,
      use_cache: true,
      model: model, // Must be the full model object
    },
    // CLIP skip
    'clip_skip': {
      id: 'clip_skip',
      type: 'clip_skip',
      is_intermediate: true,
      use_cache: true,
      clip: null,
      skipped_layers: 0,
    },
    // Positive conditioning
    'pos_cond': {
      id: 'pos_cond',
      type: 'compel',
      is_intermediate: true,
      use_cache: true,
      prompt: '',
      clip: null,
      mask: null,
    },
    // Positive conditioning collector
    'pos_cond_collect': {
      id: 'pos_cond_collect',
      type: 'collect',
      is_intermediate: true,
      use_cache: true,
      item: null,
      collection: [],
    },
    // Negative conditioning
    'neg_cond': {
      id: 'neg_cond',
      type: 'compel',
      is_intermediate: true,
      use_cache: true,
      prompt: '',
      clip: null,
      mask: null,
    },
    // Negative conditioning collector
    'neg_cond_collect': {
      id: 'neg_cond_collect',
      type: 'collect',
      is_intermediate: true,
      use_cache: true,
      item: null,
      collection: [],
    },
    // Noise
    'noise': {
      id: 'noise',
      type: 'noise',
      is_intermediate: true,
      use_cache: true,
      seed: 0,
      width: width,
      height: height,
      use_cpu: true,
    },
    // Denoise latents
    'denoise_latents': {
      id: 'denoise_latents',
      type: 'denoise_latents',
      is_intermediate: true,
      use_cache: true,
      positive_conditioning: null,
      negative_conditioning: null,
      noise: null,
      steps: steps,
      cfg_scale: cfg_scale,
      denoising_start: 0,
      denoising_end: 1,
      scheduler: 'dpmpp_3m_k',
      unet: null,
      control: null,
      ip_adapter: null,
      t2i_adapter: null,
      cfg_rescale_multiplier: 0,
      latents: null,
      denoise_mask: null,
    },
    // Output (latents to image)
    'l2i': {
      id: 'l2i',
      type: 'l2i',
      is_intermediate: false,
      use_cache: false,
      latents: null,
      vae: null,
      tiled: false,
      tile_size: 0,
      fp32: true,
    },
  };

  // Build edges - connections between nodes
  const edges = [
    // Model loader to unet
    {
      source: { node_id: 'model_loader', field: 'unet' },
      destination: { node_id: 'denoise_latents', field: 'unet' },
    },
    // Model loader clip to clip_skip clip (single, unique edge)
    {
      source: { node_id: 'model_loader', field: 'clip' },
      destination: { node_id: 'clip_skip', field: 'clip' },
    },
    // Clip skip to positive/negative conditioning
    {
      source: { node_id: 'clip_skip', field: 'clip' },
      destination: { node_id: 'pos_cond', field: 'clip' },
    },
    {
      source: { node_id: 'clip_skip', field: 'clip' },
      destination: { node_id: 'neg_cond', field: 'clip' },
    },
    // Positive prompt to positive conditioning
    {
      source: { node_id: 'positive_prompt', field: 'value' },
      destination: { node_id: 'pos_cond', field: 'prompt' },
    },
    // Positive conditioning to collector
    {
      source: { node_id: 'pos_cond', field: 'conditioning' },
      destination: { node_id: 'pos_cond_collect', field: 'item' },
    },
    // Positive collector to denoise
    {
      source: { node_id: 'pos_cond_collect', field: 'collection' },
      destination: { node_id: 'denoise_latents', field: 'positive_conditioning' },
    },
    // Negative conditioning to collector
    {
      source: { node_id: 'neg_cond', field: 'conditioning' },
      destination: { node_id: 'neg_cond_collect', field: 'item' },
    },
    // Negative collector to denoise
    {
      source: { node_id: 'neg_cond_collect', field: 'collection' },
      destination: { node_id: 'denoise_latents', field: 'negative_conditioning' },
    },
    // Seed to noise
    {
      source: { node_id: 'seed', field: 'value' },
      destination: { node_id: 'noise', field: 'seed' },
    },
    // Noise to denoise
    {
      source: { node_id: 'noise', field: 'noise' },
      destination: { node_id: 'denoise_latents', field: 'noise' },
    },
    // Denoise to l2i
    {
      source: { node_id: 'denoise_latents', field: 'latents' },
      destination: { node_id: 'l2i', field: 'latents' },
    },
    // VAE to l2i
    {
      source: { node_id: 'model_loader', field: 'vae' },
      destination: { node_id: 'l2i', field: 'vae' },
    },
  ];

  return {
    graph: { nodes, edges },
    seed: finalSeed,
  };
}

// Helper to poll queue status until completion
async function pollQueueStatus(
  endpoint: string,
  queueId: string,
  batchId: string,
  maxAttempts = 60,
  intervalMs = 2000
): Promise<QueueStatus> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const statusUrl = `${endpoint}/api/v1/queue/${queueId}/b/${batchId}/status`;
    const response = await fetch(statusUrl);

    if (!response.ok) {
      throw new Error(`Failed to get queue status: ${response.statusText}`);
    }

    const status = await response.json();
    console.log(`[InvokeAI Poll] Attempt ${attempt + 1}/${maxAttempts}, Status:`, status);

    // Check if batch is complete
    if (status.completed > 0 || status.failed > 0 || status.canceled > 0) {
      return status;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Image generation timed out - queue polling exceeded max attempts');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, invokeaiEndpoint, model, steps, guidance_scale, width, height, seed } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Connect to local InvokeAI instance
    const endpoint = invokeaiEndpoint || 'http://127.0.0.1:9090';
    console.log(`[InvokeAI Generate] Connecting to endpoint: ${endpoint}`);
    console.log(`[InvokeAI Generate] Prompt: ${prompt.substring(0, 100)}...`);

    // Fetch available models to find the correct model object
    const availableModels = await fetchModels(endpoint);
    if (availableModels.length === 0) {
      throw new Error('No models found on InvokeAI server. Please ensure models are installed.');
    }

    // Select model: use provided model name if available, otherwise default to first
    let selectedModel = availableModels[0];
    if (model) {
      const found = availableModels.find(m => m.name === model || m.id === model);
      if (found) selectedModel = found;
    } else {
      // Prefer SD 1.5 for compatibility with this generic graph structure
      // SDXL requires a different graph topology (different conditioning nodes)
      const sd1 = availableModels.find(m => m.base === 'sd-1');
      if (sd1) {
        selectedModel = sd1;
      } else {
        // Fallback to SDXL if no SD1 found (might fail with this graph)
        const sdxl = availableModels.find(m => m.base === 'sdxl');
        if (sdxl) selectedModel = sdxl;
      }
    }

    console.log(`[InvokeAI Generate] Using model: ${selectedModel.name} (${selectedModel.base})`);

    // Step 1: Build the graph
    const { graph, seed: finalSeed } = buildInvokeAIGraph({
      prompt,
      model: selectedModel, // Pass full model object
      steps,
      cfg_scale: guidance_scale,
      width,
      height,
      seed,
    });

    console.log(`[InvokeAI Generate] Built graph with seed: ${finalSeed}`);

    // Step 2: Enqueue the batch
    const enqueueUrl = `${endpoint}/api/v1/queue/${QUEUE_ID}/enqueue_batch`;
    const enqueueBody = {
      prepend: false,
      batch: {
        graph: graph,
        runs: 1,
        data: [], // Empty array - InvokeAI fills this automatically
      },
    };

    console.log(`[InvokeAI Generate] Enqueueing batch...`);

    const enqueueResponse = await fetch(enqueueUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enqueueBody),
    });

    if (!enqueueResponse.ok) {
      const errorText = await enqueueResponse.text();
      console.error(`[InvokeAI Generate] Enqueue error: ${enqueueResponse.status}`, errorText);
      throw new Error(`Failed to enqueue batch: ${enqueueResponse.statusText} - ${errorText}`);
    }

    const enqueueResult = await enqueueResponse.json();
    // InvokeAI returns batch_id inside a 'batch' object
    const batchId = enqueueResult.batch?.batch_id || enqueueResult.batch_id;
    console.log(`[InvokeAI Generate] Enqueued batch ID: ${batchId}`);
    console.log(`[InvokeAI Generate] Full enqueue response:`, JSON.stringify(enqueueResult, null, 2));

    if (!batchId) {
      throw new Error(`Failed to get batch_id from enqueue response: ${JSON.stringify(enqueueResult)}`);
    }

    // Step 3: Poll for completion
    const status = await pollQueueStatus(endpoint, QUEUE_ID, batchId);

    if (status.failed > 0) {
      throw new Error('Image generation failed in queue. Check InvokeAI server logs for details.');
    }

    if (status.canceled > 0) {
      throw new Error('Image generation was canceled');
    }

    // Step 4: Get the generated image
    // We'll try to get the latest image from the images API
    // This is a simplified approach - in production you'd track the exact output

    // Alternative: Fetch the latest image that was just created
    // Since we just generated it, we can get it from the images list
    const imagesUrl = `${endpoint}/api/v1/images/`;
    const imagesResponse = await fetch(imagesUrl);

    if (!imagesResponse.ok) {
      throw new Error('Failed to fetch generated images');
    }

    const imagesResult = await imagesResponse.json();

    if (!imagesResult.items || imagesResult.items.length === 0) {
      throw new Error('No images found after generation');
    }

    // Get the most recent image (first in list)
    const latestImage = imagesResult.items[0];
    const imageName = latestImage.image_name;

    // Step 5: Download the image as base64
    const imageUrl = `${endpoint}/api/v1/images/i/${imageName}/full`;
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to download generated image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    console.log(`[InvokeAI Generate] Successfully generated image: ${imageName}`);

    return NextResponse.json({
      image: base64Image,
      seed: finalSeed,
      model: selectedModel.name,
      image_name: imageName,
    });

  } catch (error) {
    console.error('[InvokeAI Generate] Error:', error);

    // Check if it's a connection error
    if (error instanceof Error && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
      const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
      const helpMessage = isProduction
        ? ' Note: InvokeAI must be accessible from the server.'
        : ' Make sure InvokeAI is running locally. Start it with `invokeai-web` or use the InvokeAI launcher.';
      return NextResponse.json(
        { error: `Cannot connect to InvokeAI: ${error.message}.${helpMessage}` },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}


