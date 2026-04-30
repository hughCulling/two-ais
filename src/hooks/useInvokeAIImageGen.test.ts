import { describe, expect, it } from 'vitest';
import { getInvokeAIErrorMessage } from '@/lib/invokeai';

describe('getInvokeAIErrorMessage', () => {
    it('should return the server JSON error message', async () => {
        const response = new Response(
            JSON.stringify({ error: "Selected model base 'sd-2' is not supported by this generator yet." }),
            {
                status: 400,
                statusText: 'Bad Request',
                headers: { 'Content-Type': 'application/json' },
            }
        );

        await expect(getInvokeAIErrorMessage(response)).resolves.toBe(
            "Selected model base 'sd-2' is not supported by this generator yet."
        );
    });

    it('should include plain-text response bodies with the HTTP status', async () => {
        const response = new Response('queue validation failed', {
            status: 400,
            statusText: 'Bad Request',
        });

        await expect(getInvokeAIErrorMessage(response)).resolves.toBe(
            'InvokeAI API error: 400 Bad Request - queue validation failed'
        );
    });
});
