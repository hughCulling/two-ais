// src/app/api/invokeai/result/route.ts
// Downloads the latest InvokeAI output image after a completed batch.

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchLatestInvokeAIImage,
  getInvokeAIErrorResponse,
} from '../generate/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface InvokeAIResultRequest {
  invokeaiEndpoint?: string;
  endpoint?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as InvokeAIResultRequest;
    const endpoint = body.invokeaiEndpoint || body.endpoint || 'http://127.0.0.1:9090';
    const { imageBase64, imageName } = await fetchLatestInvokeAIImage(endpoint);

    return NextResponse.json({
      image: imageBase64,
      image_name: imageName,
    });
  } catch (error) {
    return getInvokeAIErrorResponse(error);
  }
}
