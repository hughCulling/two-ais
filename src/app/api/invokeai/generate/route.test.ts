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
