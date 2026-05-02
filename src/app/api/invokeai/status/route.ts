// src/app/api/invokeai/status/route.ts
// Reads one InvokeAI batch status snapshot per request.

import { NextRequest, NextResponse } from 'next/server';
import {
  QUEUE_ID,
  getInvokeAIErrorResponse,
  getInvokeAIQueueStatus,
} from '../generate/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface InvokeAIStatusRequest {
  batchId?: string;
  invokeaiEndpoint?: string;
  endpoint?: string;
  queueId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as InvokeAIStatusRequest;
    const batchId = typeof body.batchId === 'string' ? body.batchId.trim() : '';
    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 });
    }

    const endpoint = body.invokeaiEndpoint || body.endpoint || 'http://127.0.0.1:9090';
    const queueId = body.queueId || QUEUE_ID;
    const status = await getInvokeAIQueueStatus(endpoint, queueId, batchId);

    return NextResponse.json({
      status,
      done: status.completed > 0 || status.failed > 0 || status.canceled > 0,
    });
  } catch (error) {
    return getInvokeAIErrorResponse(error);
  }
}
