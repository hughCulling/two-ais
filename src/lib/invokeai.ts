// src/lib/invokeai.ts
// InvokeAI detection and utility functions

export interface InvokeAIModel {
    id: string;
    name: string;
    description?: string;
}

export interface InvokeAIModelsResponse {
    models: InvokeAIModel[];
}

/**
 * Check if InvokeAI server is available on the local machine
 * Default endpoint: http://localhost:9090
 */
export async function isInvokeAIAvailable(endpoint: string = 'http://localhost:9090'): Promise<boolean> {
    try {
        // Try to access the InvokeAI API models endpoint
        // Using v2 API: /api/v2/models/
        const response = await fetch(`${endpoint}/api/v2/models/`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        return response.ok;
    } catch (error) {
        console.debug('InvokeAI not available:', error);
        return false;
    }
}

/**
 * Fetch available models from local InvokeAI instance
 */
export async function fetchInvokeAIModels(endpoint: string = 'http://localhost:9090'): Promise<InvokeAIModel[]> {
    try {
        const response = await fetch(`${endpoint}/api/v2/models/`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch InvokeAI models: ${response.statusText}`);
        }

        const data: InvokeAIModelsResponse = await response.json();
        return data.models || [];
    } catch (error) {
        console.error('Error fetching InvokeAI models:', error);
        return [];
    }
}

/**
 * Generate an image using InvokeAI
 * This will be called from the API route, not directly from the client
 */
export interface InvokeAIImageGenerationParams {
    prompt: string;
    model?: string;
    steps?: number;
    guidance_scale?: number;
    width?: number;
    height?: number;
    seed?: number;
}

export interface InvokeAIImageGenerationResponse {
    image: string; // base64 encoded image
    seed?: number;
    model?: string;
}



