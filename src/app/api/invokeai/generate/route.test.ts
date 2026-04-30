// src/app/api/invokeai/generate/route.test.ts
// Unit tests for /api/invokeai/generate API endpoint (InvokeAI integration)

import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Helper to create a NextRequest with JSON body
function makeJsonRequest(url: string, body: any) {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('/api/invokeai/generate API Endpoint', () => {
  let originalFetch: typeof global.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    originalFetch = global.fetch as any;
    fetchMock = vi.fn();
    (global as any).fetch = fetchMock;
  });

  const defaultEndpoint = 'http://localhost:9090';

  it('should enqueue a valid SD1 graph (no duplicate clip edges) and return base64 image', async () => {
    // Capture the enqueued graph to assert edges
    let enqueuedGraph: any | null = null;

    // Mock responses for the full happy path
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      // 1) Models list
      if (url.includes('/api/v2/models')) {
        return {
          ok: true,
          json: async () => ({
            models: [
              { id: 'dreamshaper-8', name: 'Dreamshaper 8', base: 'sd-1', type: 'main', key: 'k', hash: 'h' },
            ],
          }),
        } as any;
      }

      // 2) Enqueue batch
      if (url.includes('/api/v1/queue/default/enqueue_batch')) {
        // Capture the posted graph
        if (init && init.body && typeof init.body === 'string') {
          const parsed = JSON.parse(init.body);
          enqueuedGraph = parsed?.batch?.graph;
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            queue_id: 'default',
            enqueued: 1,
            requested: 1,
            batch: { batch_id: 'batch-123' },
          }),
          text: async () => 'ok',
        } as any;
      }

      // 3) Poll status (first pending, then completed)
      if (url.includes('/api/v1/queue/default/b/batch-123/status')) {
        // Return completed on first poll for speed
        return {
          ok: true,
          status: 200,
          json: async () => ({
            queue_id: 'default',
            batch_id: 'batch-123',
            pending: 0,
            in_progress: 0,
            completed: 1,
            failed: 0,
            canceled: 0,
            total: 1,
          }),
        } as any;
      }

      // 4) List images
      if (url.endsWith('/api/v1/images/') || url.endsWith('/api/v1/images')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ items: [{ image_name: 'image-abc.png' }] }),
        } as any;
      }

      // 5) Download image
      if (url.includes('/api/v1/images/i/image-abc.png/full')) {
        const buf = new TextEncoder().encode('dummy-image-bytes').buffer;
        return {
          ok: true,
          status: 200,
          arrayBuffer: async () => buf,
        } as any;
      }

      // Fallback (should not happen)
      return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) } as any;
    });

    const req = makeJsonRequest('http://localhost:3000/api/invokeai/generate', {
      prompt: 'A test prompt',
      invokeaiEndpoint: defaultEndpoint,
      steps: 10,
      width: 256,
      height: 256,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.image).toBe('string');
    expect(data.image.length).toBeGreaterThan(0);

    // Validate graph was sent and has a single model_loader.clip -> clip_skip.clip edge
    expect(enqueuedGraph).toBeTruthy();
    const edges = enqueuedGraph.edges as Array<any>;
    const clipEdges = edges.filter(
      (e) =>
        e?.source?.node_id === 'model_loader' &&
        e?.source?.field === 'clip' &&
        e?.destination?.node_id === 'clip_skip' &&
        e?.destination?.field === 'clip'
    );
    expect(clipEdges.length).toBe(1);

    // Ensure there are no duplicate identical edges in the entire graph
    const edgeKeys = edges.map((e) => JSON.stringify(e));
    const uniqueEdgeKeys = new Set(edgeKeys);
    expect(uniqueEdgeKeys.size).toBe(edgeKeys.length);
  });

  it('should enqueue an SD1 graph with LoRA nodes when lora_key resolves', async () => {
    let enqueuedGraph: any | null = null;

    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      if (url.includes('model_type=lora')) {
        return {
          ok: true,
          json: async () => ({
            models: [
              { id: 'lora-id', key: 'lora-key-1', name: 'Test LoRA', base: 'sd-1', type: 'lora', hash: 'h' },
            ],
          }),
        } as any;
      }

      if (url.includes('/api/v2/models')) {
        return {
          ok: true,
          json: async () => ({
            models: [
              { id: 'dreamshaper-8', name: 'Dreamshaper 8', base: 'sd-1', type: 'main', key: 'k-main', hash: 'hm' },
            ],
          }),
        } as any;
      }

      if (url.includes('/api/v1/queue/default/enqueue_batch')) {
        if (init && init.body && typeof init.body === 'string') {
          const parsed = JSON.parse(init.body);
          enqueuedGraph = parsed?.batch?.graph;
        }
        return {
          ok: true,
          json: async () => ({ batch: { batch_id: 'batch-lora' } }),
        } as any;
      }

      if (url.includes('/api/v1/queue/default/b/batch-lora/status')) {
        return {
          ok: true,
          json: async () => ({ completed: 1, failed: 0, canceled: 0 }),
        } as any;
      }

      if (url.endsWith('/api/v1/images/') || url.endsWith('/api/v1/images')) {
        return {
          ok: true,
          json: async () => ({ items: [{ image_name: 'lora-img.png' }] }),
        } as any;
      }

      if (url.includes('/api/v1/images/i/lora-img.png/full')) {
        const buf = new TextEncoder().encode('x').buffer;
        return { ok: true, arrayBuffer: async () => buf } as any;
      }

      return { ok: false, status: 404, json: async () => ({}) } as any;
    });

    const req = makeJsonRequest('http://localhost:3000/api/invokeai/generate', {
      prompt: 'LoRA test',
      invokeaiEndpoint: defaultEndpoint,
      model: 'Dreamshaper 8',
      lora_key: 'lora-key-1',
      lora_weight: 0.75,
      steps: 5,
      width: 256,
      height: 256,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(enqueuedGraph?.nodes?.lora_selector).toBeTruthy();
    expect(enqueuedGraph?.nodes?.lora_collection_loader).toBeTruthy();
    const edges = enqueuedGraph.edges as Array<{ source: { node_id: string; field: string }; destination: { node_id: string; field: string } }>;
    expect(
      edges.some(
        (e) =>
          e.source.node_id === 'lora_collection_loader' &&
          e.destination.node_id === 'denoise_latents' &&
          e.source.field === 'unet'
      )
    ).toBe(true);
  });

  it('should enqueue a valid SDXL graph and preserve requested dimensions', async () => {
    let enqueuedGraph: any | null = null;

    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      if (url.includes('/api/v2/models')) {
        return {
          ok: true,
          json: async () => ({
            models: [{
              id: 'juggernaut-xl-v9',
              name: 'Juggernaut XL v9',
              base: 'sdxl',
              type: 'main',
              key: 'k-sdxl',
              hash: 'h-sdxl',
            }],
          }),
        } as any;
      }

      if (url.includes('/api/v1/queue/default/enqueue_batch')) {
        if (init && init.body && typeof init.body === 'string') {
          const parsed = JSON.parse(init.body);
          enqueuedGraph = parsed?.batch?.graph;
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ batch: { batch_id: 'batch-sdxl' } }),
          text: async () => 'ok',
        } as any;
      }

      if (url.includes('/api/v1/queue/default/b/batch-sdxl/status')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ completed: 1, failed: 0, canceled: 0 }),
        } as any;
      }

      if (url.endsWith('/api/v1/images/') || url.endsWith('/api/v1/images')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ items: [{ image_name: 'sdxl-img.png' }] }),
        } as any;
      }

      if (url.includes('/api/v1/images/i/sdxl-img.png/full')) {
        const buf = new TextEncoder().encode('sdxl-image-bytes').buffer;
        return {
          ok: true,
          status: 200,
          arrayBuffer: async () => buf,
        } as any;
      }

      return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) } as any;
    });

    const req = makeJsonRequest('http://localhost:3000/api/invokeai/generate', {
      prompt: 'A cowboy',
      invokeaiEndpoint: defaultEndpoint,
      model: 'Juggernaut XL v9',
      negative_prompt: 'blurry',
      steps: 30,
      guidance_scale: 7,
      width: 768,
      height: 640,
      seed: 1925450283,
      scheduler: 'dpmpp_3m_k',
      cfg_rescale_multiplier: 0,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.model).toBe('Juggernaut XL v9');
    expect(enqueuedGraph).toBeTruthy();

    expect(enqueuedGraph.nodes.model_loader.type).toBe('sdxl_model_loader');
    expect(enqueuedGraph.nodes.pos_cond.type).toBe('sdxl_compel_prompt');
    expect(enqueuedGraph.nodes.neg_cond.type).toBe('sdxl_compel_prompt');
    expect(enqueuedGraph.nodes.pos_cond.original_width).toBe(768);
    expect(enqueuedGraph.nodes.pos_cond.original_height).toBe(640);
    expect(enqueuedGraph.nodes.pos_cond.target_width).toBe(768);
    expect(enqueuedGraph.nodes.pos_cond.target_height).toBe(640);
    expect(enqueuedGraph.nodes.neg_cond.prompt).toBe('blurry');
    expect(enqueuedGraph.nodes.noise.width).toBe(768);
    expect(enqueuedGraph.nodes.noise.height).toBe(640);
    expect(enqueuedGraph.nodes.core_metadata.generation_mode).toBe('sdxl_txt2img');
    expect(enqueuedGraph.nodes.core_metadata.width).toBe(768);
    expect(enqueuedGraph.nodes.core_metadata.height).toBe(640);
    expect(enqueuedGraph.nodes.clip_skip).toBeUndefined();

    const edges = enqueuedGraph.edges as Array<{
      source: { node_id: string; field: string };
      destination: { node_id: string; field: string };
    }>;
    expect(
      edges.some(
        (e) =>
          e.source.node_id === 'model_loader' &&
          e.source.field === 'clip2' &&
          e.destination.node_id === 'pos_cond' &&
          e.destination.field === 'clip2'
      )
    ).toBe(true);
    expect(
      edges.some(
        (e) =>
          e.source.node_id === 'core_metadata' &&
          e.source.field === 'metadata' &&
          e.destination.node_id === 'l2i' &&
          e.destination.field === 'metadata'
      )
    ).toBe(true);
  });

  it('should return 500 if queue reports failed', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      if (url.includes('/api/v2/models')) {
        return { ok: true, json: async () => ({ models: [{ id: 'm', name: 'Dreamshaper 8', base: 'sd-1', type: 'main' }] }) } as any;
      }
      if (url.includes('/api/v1/queue/default/enqueue_batch')) {
        return { ok: true, json: async () => ({ batch: { batch_id: 'batch-err' } }) } as any;
      }
      if (url.includes('/api/v1/queue/default/b/batch-err/status')) {
        return {
          ok: true,
          json: async () => ({ pending: 0, in_progress: 0, completed: 0, failed: 1, canceled: 0, total: 1 }),
        } as any;
      }

      return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) } as any;
    });

    const req = makeJsonRequest('http://localhost:3000/api/invokeai/generate', {
      prompt: 'Failure case',
      invokeaiEndpoint: defaultEndpoint,
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect((data.error || '').toLowerCase()).toContain('failed');
  });

  it('should return 500 when no models found on InvokeAI server', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes('/api/v2/models')) {
        return { ok: true, json: async () => ({ models: [] }) } as any;
      }
      return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) } as any;
    });

    const req = makeJsonRequest('http://localhost:3000/api/invokeai/generate', {
      prompt: 'Test no models',
      invokeaiEndpoint: defaultEndpoint,
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect((data.error || '').toLowerCase()).toContain('no models');
  });

  // Restore fetch after all tests in this file
  afterAll(() => {
    (global as any).fetch = originalFetch;
  });
});
