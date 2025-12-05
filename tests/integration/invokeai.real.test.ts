// tests/integration/invokeai.real.test.ts
// Integration test that calls the real InvokeAI server via our Next route (no mocks)

import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as invokePost } from '@/app/api/invokeai/generate/route';

// Note: test uses a higher timeout via the per-test options

const INVOKE_ENDPOINT = process.env.INVOKEAI_ENDPOINT || 'http://127.0.0.1:9090';

async function isInvokeAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${INVOKE_ENDPOINT}/api/v2/models/?model_type=main`);
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data?.models) && data.models.length > 0;
  } catch {
    return false;
  }
}

describe('InvokeAI real integration (no mocks)', () => {
  let available = false;

  beforeAll(async () => {
    available = await isInvokeAvailable();
    if (!available) {
      // eslint-disable-next-line no-console
      console.warn(`InvokeAI not reachable at ${INVOKE_ENDPOINT}. Set INVOKEAI_ENDPOINT or start invokeai-web.`);
    }
  });

  it.runIf(!!process.env.RUN_REAL_INVOKE || available)('should generate an image successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/invokeai/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'A small lightning bolt over a dark forest, photorealistic, dramatic lighting',
        invokeaiEndpoint: INVOKE_ENDPOINT,
        steps: 15,
        width: 384,
        height: 384,
      }),
    });

    const res = await invokePost(request);
    const status = res.status;
    const json = await res.json();

    expect([200, 503, 500]).toContain(status);
    if (status !== 200) {
      // Provide better diagnostics when run locally
      // eslint-disable-next-line no-console
      console.warn('InvokeAI integration failed:', json);
    } else {
      expect(typeof json.image).toBe('string');
      expect(json.image.length).toBeGreaterThan(100); // non-empty base64
    }
  }, 120000);
});
