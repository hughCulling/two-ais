// src/app/api/invokeai/enqueue/route.ts
// Starts an InvokeAI batch quickly so client polling can avoid long serverless waits.

import { NextRequest, NextResponse } from 'next/server';
import {
  QUEUE_ID,
  enqueueInvokeAIBatch,
  getInvokeAIErrorResponse,
  prepareInvokeAIGeneration,
  type InvokeAIGenerationInput,
} from '../generate/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as InvokeAIGenerationInput;
    const prepared = await prepareInvokeAIGeneration(body);
    const batchId = await enqueueInvokeAIBatch(prepared.endpoint, prepared.graph);

    return NextResponse.json({
      batchId,
      queueId: QUEUE_ID,
      endpoint: prepared.endpoint,
      seed: prepared.seed,
      model: prepared.modelName,
    });
  } catch (error) {
    return getInvokeAIErrorResponse(error);
  }
}
