// src/app/api/invokeai/generate/route.ts
// Local API route to generate images using InvokeAI's queue-based workflow system
// This bypasses Firebase Functions and connects directly to local InvokeAI server

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

interface GraphEdge {
  source: { node_id: string; field: string };
  destination: { node_id: string; field: string };
}

interface GraphBuildParams {
  prompt: string;
  model: InvokeAIModel;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  seed?: number;
  scheduler?: string;
  clip_skip?: number;
  cfg_rescale_multiplier?: number;
  negative_prompt?: string;
  lora?: InvokeAIModel | null;
  lora_weight?: number;
}

interface GraphBuildResult {
  graph: { nodes: Record<string, GraphNode>; edges: GraphEdge[] };
  seed: number;
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

async function fetchLoRAModels(endpoint: string): Promise<InvokeAIModel[]> {
  try {
    const response = await fetch(`${endpoint}/api/v2/models/?model_type=lora`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Failed to fetch LoRA models:', error);
    return [];
  }
}

function buildSD1InvokeAIGraph(params: GraphBuildParams): GraphBuildResult {
  const {
    prompt,
    model,
    steps = 30,
    cfg_scale = 7.5,
    width = 512,
    height = 512,
    seed,
    scheduler = 'dpmpp_3m_k',
    clip_skip = 0,
    cfg_rescale_multiplier = 0,
    lora = null,
    lora_weight = 0.75,
  } = params;

  const useLora = Boolean(lora);

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
      skipped_layers: clip_skip,
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
      scheduler,
      unet: null,
      control: null,
      ip_adapter: null,
      t2i_adapter: null,
      cfg_rescale_multiplier,
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

  if (useLora) {
    nodes['lora_selector'] = {
      id: 'lora_selector',
      type: 'lora_selector',
      is_intermediate: true,
      use_cache: true,
      lora,
      weight: typeof lora_weight === 'number' && Number.isFinite(lora_weight) ? lora_weight : 0.75,
    };
    nodes['lora_collector'] = {
      id: 'lora_collector',
      type: 'collect',
      is_intermediate: true,
      use_cache: true,
      item: null,
      collection: [],
    };
    nodes['lora_collection_loader'] = {
      id: 'lora_collection_loader',
      type: 'lora_collection_loader',
      is_intermediate: true,
      use_cache: true,
      loras: null,
      unet: null,
      clip: null,
    };
  }

  const unetAndClipEdges: GraphEdge[] = useLora
    ? [
      {
        source: { node_id: 'lora_selector', field: 'lora' },
        destination: { node_id: 'lora_collector', field: 'item' },
      },
      {
        source: { node_id: 'lora_collector', field: 'collection' },
        destination: { node_id: 'lora_collection_loader', field: 'loras' },
      },
      {
        source: { node_id: 'model_loader', field: 'unet' },
        destination: { node_id: 'lora_collection_loader', field: 'unet' },
      },
      {
        source: { node_id: 'clip_skip', field: 'clip' },
        destination: { node_id: 'lora_collection_loader', field: 'clip' },
      },
      {
        source: { node_id: 'lora_collection_loader', field: 'unet' },
        destination: { node_id: 'denoise_latents', field: 'unet' },
      },
      {
        source: { node_id: 'lora_collection_loader', field: 'clip' },
        destination: { node_id: 'pos_cond', field: 'clip' },
      },
      {
        source: { node_id: 'lora_collection_loader', field: 'clip' },
        destination: { node_id: 'neg_cond', field: 'clip' },
      },
    ]
    : [
      {
        source: { node_id: 'model_loader', field: 'unet' },
        destination: { node_id: 'denoise_latents', field: 'unet' },
      },
      {
        source: { node_id: 'clip_skip', field: 'clip' },
        destination: { node_id: 'pos_cond', field: 'clip' },
      },
      {
        source: { node_id: 'clip_skip', field: 'clip' },
        destination: { node_id: 'neg_cond', field: 'clip' },
      },
    ];

  // Build edges - connections between nodes
  const edges: GraphEdge[] = [
    // Model loader clip to clip_skip clip (single, unique edge)
    {
      source: { node_id: 'model_loader', field: 'clip' },
      destination: { node_id: 'clip_skip', field: 'clip' },
    },
    ...unetAndClipEdges,
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

function buildSDXLInvokeAIGraph(params: GraphBuildParams): GraphBuildResult {
  const {
    prompt,
    model,
    steps = 30,
    cfg_scale = 7.5,
    width = 512,
    height = 512,
    seed,
    scheduler = 'dpmpp_3m_k',
    cfg_rescale_multiplier = 0,
    negative_prompt = '',
  } = params;

  const finalSeed = seed ?? Math.floor(Math.random() * 2147483647);

  const nodes: Record<string, GraphNode> = {
    'model_loader': {
      id: 'model_loader',
      type: 'sdxl_model_loader',
      is_intermediate: true,
      use_cache: true,
      model,
    },
    'positive_prompt': {
      id: 'positive_prompt',
      type: 'string',
      is_intermediate: true,
      use_cache: true,
      value: prompt,
    },
    'pos_cond': {
      id: 'pos_cond',
      type: 'sdxl_compel_prompt',
      is_intermediate: true,
      use_cache: true,
      prompt: '',
      style: '',
      original_width: width,
      original_height: height,
      crop_top: 0,
      crop_left: 0,
      target_width: width,
      target_height: height,
      clip: null,
      clip2: null,
      mask: null,
    },
    'pos_cond_collect': {
      id: 'pos_cond_collect',
      type: 'collect',
      is_intermediate: true,
      use_cache: true,
      item: null,
      collection: [],
    },
    'neg_cond': {
      id: 'neg_cond',
      type: 'sdxl_compel_prompt',
      is_intermediate: true,
      use_cache: true,
      prompt: negative_prompt,
      style: '',
      original_width: width,
      original_height: height,
      crop_top: 0,
      crop_left: 0,
      target_width: width,
      target_height: height,
      clip: null,
      clip2: null,
      mask: null,
    },
    'neg_cond_collect': {
      id: 'neg_cond_collect',
      type: 'collect',
      is_intermediate: true,
      use_cache: true,
      item: null,
      collection: [],
    },
    'seed': {
      id: 'seed',
      type: 'integer',
      is_intermediate: true,
      use_cache: true,
      value: finalSeed,
    },
    'noise': {
      id: 'noise',
      type: 'noise',
      is_intermediate: true,
      use_cache: true,
      seed: 0,
      width,
      height,
      use_cpu: true,
    },
    'denoise_latents': {
      id: 'denoise_latents',
      type: 'denoise_latents',
      is_intermediate: true,
      use_cache: true,
      positive_conditioning: null,
      negative_conditioning: null,
      noise: null,
      steps,
      cfg_scale,
      denoising_start: 0,
      denoising_end: 1,
      scheduler,
      unet: null,
      control: null,
      ip_adapter: null,
      t2i_adapter: null,
      cfg_rescale_multiplier,
      latents: null,
      denoise_mask: null,
    },
    'core_metadata': {
      id: 'core_metadata',
      type: 'core_metadata',
      is_intermediate: true,
      use_cache: true,
      generation_mode: 'sdxl_txt2img',
      positive_prompt: null,
      negative_prompt,
      width,
      height,
      seed: null,
      rand_device: 'cpu',
      cfg_scale,
      cfg_rescale_multiplier,
      steps,
      scheduler,
      seamless_x: false,
      seamless_y: false,
      clip_skip: null,
      model,
      controlnets: null,
      ipAdapters: null,
      t2iAdapters: null,
      loras: null,
      strength: null,
      init_image: null,
      vae: null,
      qwen3_encoder: null,
      hrf_enabled: null,
      hrf_method: null,
      hrf_strength: null,
      positive_style_prompt: null,
      negative_style_prompt: null,
      refiner_model: null,
      refiner_cfg_scale: null,
      refiner_steps: null,
      refiner_scheduler: null,
      refiner_positive_aesthetic_score: null,
      refiner_negative_aesthetic_score: null,
      refiner_start: null,
      ref_images: [],
    },
    'l2i': {
      id: 'l2i',
      type: 'l2i',
      is_intermediate: false,
      use_cache: false,
      board: null,
      metadata: null,
      latents: null,
      vae: null,
      tiled: false,
      tile_size: 0,
      fp32: true,
    },
  };

  const edges: GraphEdge[] = [
    {
      source: { node_id: 'model_loader', field: 'unet' },
      destination: { node_id: 'denoise_latents', field: 'unet' },
    },
    {
      source: { node_id: 'model_loader', field: 'clip' },
      destination: { node_id: 'pos_cond', field: 'clip' },
    },
    {
      source: { node_id: 'model_loader', field: 'clip' },
      destination: { node_id: 'neg_cond', field: 'clip' },
    },
    {
      source: { node_id: 'model_loader', field: 'clip2' },
      destination: { node_id: 'pos_cond', field: 'clip2' },
    },
    {
      source: { node_id: 'model_loader', field: 'clip2' },
      destination: { node_id: 'neg_cond', field: 'clip2' },
    },
    {
      source: { node_id: 'positive_prompt', field: 'value' },
      destination: { node_id: 'pos_cond', field: 'prompt' },
    },
    {
      source: { node_id: 'positive_prompt', field: 'value' },
      destination: { node_id: 'pos_cond', field: 'style' },
    },
    {
      source: { node_id: 'pos_cond', field: 'conditioning' },
      destination: { node_id: 'pos_cond_collect', field: 'item' },
    },
    {
      source: { node_id: 'pos_cond_collect', field: 'collection' },
      destination: { node_id: 'denoise_latents', field: 'positive_conditioning' },
    },
    {
      source: { node_id: 'neg_cond', field: 'conditioning' },
      destination: { node_id: 'neg_cond_collect', field: 'item' },
    },
    {
      source: { node_id: 'neg_cond_collect', field: 'collection' },
      destination: { node_id: 'denoise_latents', field: 'negative_conditioning' },
    },
    {
      source: { node_id: 'seed', field: 'value' },
      destination: { node_id: 'noise', field: 'seed' },
    },
    {
      source: { node_id: 'noise', field: 'noise' },
      destination: { node_id: 'denoise_latents', field: 'noise' },
    },
    {
      source: { node_id: 'denoise_latents', field: 'latents' },
      destination: { node_id: 'l2i', field: 'latents' },
    },
    {
      source: { node_id: 'seed', field: 'value' },
      destination: { node_id: 'core_metadata', field: 'seed' },
    },
    {
      source: { node_id: 'positive_prompt', field: 'value' },
      destination: { node_id: 'core_metadata', field: 'positive_prompt' },
    },
    {
      source: { node_id: 'model_loader', field: 'vae' },
      destination: { node_id: 'l2i', field: 'vae' },
    },
    {
      source: { node_id: 'core_metadata', field: 'metadata' },
      destination: { node_id: 'l2i', field: 'metadata' },
    },
  ];

  return {
    graph: { nodes, edges },
    seed: finalSeed,
  };
}

function buildInvokeAIGraph(params: GraphBuildParams): GraphBuildResult {
  if (params.model.base === 'sdxl') {
    return buildSDXLInvokeAIGraph(params);
  }
  return buildSD1InvokeAIGraph(params);
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
    const {
      prompt,
      invokeaiEndpoint,
      model,
      steps,
      guidance_scale,
      width,
      height,
      seed,
      negative_prompt,
      scheduler,
      clip_skip,
      cfg_rescale_multiplier,
    } = body;

    const loraKeyRaw = typeof body.lora_key === 'string' ? body.lora_key : (typeof body.loraKey === 'string' ? body.loraKey : '');
    const loraWeightParsed = typeof body.lora_weight === 'number'
      ? body.lora_weight
      : typeof body.loraWeight === 'number'
        ? body.loraWeight
        : undefined;

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
      const compatibleModel = availableModels.find(m => m.base === 'sd-1' || m.base === 'sdxl');
      if (compatibleModel) selectedModel = compatibleModel;
    }

    console.log(`[InvokeAI Generate] Using model: ${selectedModel.name} (${selectedModel.base})`);

    let selectedLora: InvokeAIModel | null = null;
    const loraLookupKey = typeof loraKeyRaw === 'string' ? loraKeyRaw.trim() : '';
    if (loraLookupKey) {
      const loraCandidates = await fetchLoRAModels(endpoint);
      const found = loraCandidates.find((m) => {
        const key = typeof m.key === 'string' ? m.key : '';
        const id = typeof (m as { id?: string }).id === 'string' ? (m as { id?: string }).id : '';
        return (
          key === loraLookupKey ||
          id === loraLookupKey ||
          (typeof (m as { name?: string }).name === 'string' && (m as { name: string }).name === loraLookupKey)
        );
      });
      if (!found) {
        return NextResponse.json(
          {
            error: `LoRA not found for "${loraLookupKey}". Refresh models in Session Setup or check Invoke\'s LoRA installs.`,
          },
          { status: 400 }
        );
      }
      if (found.base && selectedModel.base && found.base !== selectedModel.base) {
        return NextResponse.json(
          {
            error: `Selected LoRA base '${found.base}' does not match the main model base '${selectedModel.base}'.`,
            selectedLora: { name: found.name, base: found.base },
            selectedModel: { name: selectedModel.name, base: selectedModel.base },
          },
          { status: 400 }
        );
      }
      selectedLora = found;
      console.log(`[InvokeAI Generate] Using LoRA: ${selectedLora.name}`);
    }

    // Some model bases (e.g. SD-2 or tiny/specialty pipelines) require different graph topology.
    // Fail fast with a clear message rather than returning a generic 500 later.
    if (selectedModel.base !== 'sd-1' && selectedModel.base !== 'sdxl') {
      return NextResponse.json(
        {
          error: `Selected model base '${selectedModel.base}' is not supported by this generator yet. Please choose an SD-1 or SDXL model.`,
          selectedModel: { id: selectedModel.id, name: selectedModel.name, base: selectedModel.base },
        },
        { status: 400 }
      );
    }

    if (selectedLora && selectedModel.base !== 'sd-1') {
      return NextResponse.json(
        {
          error: 'LoRA image generation currently supports SD-1 models only. Please remove the LoRA or choose an SD-1 model.',
          selectedLora: { name: selectedLora.name, base: selectedLora.base },
          selectedModel: { name: selectedModel.name, base: selectedModel.base },
        },
        { status: 400 }
      );
    }

    // Step 1: Build the graph
    const resolvedLoraWeight = typeof loraWeightParsed === 'number' && Number.isFinite(loraWeightParsed)
      ? Math.max(-2, Math.min(4, loraWeightParsed))
      : 0.75;

    const { graph, seed: finalSeed } = buildInvokeAIGraph({
      prompt,
      model: selectedModel, // Pass full model object
      steps,
      cfg_scale: guidance_scale,
      width,
      height,
      seed,
      negative_prompt,
      scheduler,
      clip_skip,
      cfg_rescale_multiplier,
      ...(selectedLora ? { lora: selectedLora, lora_weight: resolvedLoraWeight } : { lora: null }),
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
