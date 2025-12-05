// src/hooks/useInvokeAI.ts
import { useState, useEffect } from 'react';
import { isInvokeAIAvailable, fetchInvokeAIModels, InvokeAIModel } from '@/lib/invokeai';

export function useInvokeAI(endpoint: string = 'http://localhost:9090') {
    const [isAvailable, setIsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState<InvokeAIModel[]>([]);

    useEffect(() => {
        let mounted = true;

        async function checkInvokeAI() {
            setIsLoading(true);
            try {
                const available = await isInvokeAIAvailable(endpoint);
                if (!mounted) return;
                
                setIsAvailable(available);
                
                if (available) {
                    const fetchedModels = await fetchInvokeAIModels(endpoint);
                    if (mounted) {
                        setModels(fetchedModels);
                    }
                } else {
                    setModels([]);
                }
            } catch (error) {
                console.error('Error checking InvokeAI:', error);
                if (mounted) {
                    setIsAvailable(false);
                    setModels([]);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        checkInvokeAI();

        return () => {
            mounted = false;
        };
    }, [endpoint]);

    return { isAvailable, isLoading, models };
}



