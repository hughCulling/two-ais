// src/hooks/useOllama.ts
import { useState, useEffect } from 'react';
import { isOllamaAvailable, updateOllamaModels, OLLAMA_MODELS } from '@/lib/models';

export function useOllama(endpoint: string = 'http://localhost:11434') {
    const [isAvailable, setIsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState(OLLAMA_MODELS);

    useEffect(() => {
        let mounted = true;

        async function checkOllama() {
            setIsLoading(true);
            try {
                const available = await isOllamaAvailable(endpoint);
                if (!mounted) return;
                
                setIsAvailable(available);
                
                if (available) {
                    await updateOllamaModels(endpoint);
                    if (mounted) {
                        setModels([...OLLAMA_MODELS]);
                    }
                }
            } catch (error) {
                console.error('Error checking Ollama:', error);
                if (mounted) {
                    setIsAvailable(false);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        checkOllama();

        return () => {
            mounted = false;
        };
    }, [endpoint]);

    return { isAvailable, isLoading, models };
}
