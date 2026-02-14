// src/hooks/useOllamaAgent.ts
// Client-side hook to handle Ollama model responses locally
// This bypasses Firebase Functions for local Ollama models

import { useEffect, useRef } from 'react';
import { doc, collection, onSnapshot, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, rtdb } from '@/lib/firebase/clientApp';
import { ref, set, update } from 'firebase/database';

export function useOllamaAgent(conversationId: string | null, userId: string | null) {
  const processingRef = useRef(false);

  useEffect(() => {
    if (!conversationId || !userId) return;

    // Listen to conversation changes
    const conversationRef = doc(db, 'conversations', conversationId);

    const unsubscribe = onSnapshot(conversationRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      // Check if we need to respond with Ollama
      const shouldRespond =
        data.status === 'running' &&
        !data.processingLock &&
        !data.waitingForTTSEndSignal && // Don't respond if waiting for TTS to finish
        data.turn &&
        (data.agentA_llm?.startsWith('ollama:') || data.agentB_llm?.startsWith('ollama:'));

      if (!shouldRespond || processingRef.current) return;

      const agentToRespond = data.turn;
      const agentModelId = agentToRespond === 'agentA' ? data.agentA_llm : data.agentB_llm;

      // Only handle if this agent uses Ollama
      if (!agentModelId?.startsWith('ollama:')) return;

      processingRef.current = true;

      // Add a small delay for agentB to avoid concurrent requests to Ollama
      // since OLLAMA_NUM_PARALLEL is often set to 1
      if (agentToRespond === 'agentB') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      try {
        // Check lookahead limit (same as Firebase Function)
        const LOOKAHEAD_LIMIT = 3;
        const { getDocs, query: firestoreQuery, orderBy: firestoreOrderBy, limit: firestoreLimit } = await import('firebase/firestore');
        const messagesQuery = firestoreQuery(
          collection(db, 'conversations', conversationId, 'messages'),
          firestoreOrderBy('timestamp', 'asc')
        );
        const allMessagesSnap = await getDocs(messagesQuery);
        const allMessages = allMessagesSnap.docs.map(doc => ({
          id: doc.id,
          role: doc.data().role,
        }));

        // Find index of last played message
        let lastPlayedIdx = -1;
        if (data.lastPlayedAgentMessageId) {
          lastPlayedIdx = allMessages.findIndex(m => m.id === data.lastPlayedAgentMessageId);
        }

        // Count agent messages ahead
        let agentMessagesAhead = 0;
        for (let i = lastPlayedIdx + 1; i < allMessages.length; i++) {
          if (allMessages[i].role === 'agentA' || allMessages[i].role === 'agentB') {
            agentMessagesAhead++;
          }
        }

        if (agentMessagesAhead >= LOOKAHEAD_LIMIT) {
          console.log(`[Ollama Lookahead] ${agentMessagesAhead} messages ahead. Limit is ${LOOKAHEAD_LIMIT}. Skipping.`);
          processingRef.current = false;
          return;
        }

        // Set processing lock
        await updateDoc(conversationRef, {
          processingLock: true,
          [`${agentToRespond}Processing`]: true,
        });

        // Fetch recent messages for context (reuse the imports from above)
        const historyQuery = firestoreQuery(
          collection(db, 'conversations', conversationId, 'messages'),
          firestoreOrderBy('timestamp', 'asc'),
          firestoreLimit(20)
        );
        const historySnap = await getDocs(historyQuery);

        const messages = historySnap.docs.map(doc => {
          const data = doc.data();
          const mappedRole = data.role === agentToRespond ? 'assistant' :
            data.role === 'system' ? 'system' : 'user';
          return {
            role: mappedRole,
            content: data.content,
          };
        });

        console.log(`[Ollama] Fetched ${messages.length} messages for ${agentToRespond} context:`,
          messages.map(m => ({ role: m.role, preview: m.content.substring(0, 50) + '...' })));

        // Extract model name (format: "ollama:modelname")
        const modelName = agentModelId.replace(/^ollama:/, '');
        const ollamaEndpoint = data.ollamaEndpoint || 'http://localhost:11434';

        // Create message ID for streaming
        const messageId = doc(collection(db, 'dummy')).id;
        const rtdbRef = ref(rtdb, `/streamingMessages/${conversationId}/${messageId}`);

        await set(rtdbRef, {
          role: agentToRespond,
          content: '',
          status: 'streaming',
          timestamp: Date.now(),
        });

        // Stream from local Ollama with retry logic
        // We'll prefer a direct browser connection if possible to bypass Vercel timeouts
        let fullContent = '';
        let retryCount = 0;
        const maxRetries = 2;
        let streamSuccess = false;

        while (retryCount <= maxRetries && !streamSuccess) {
          try {
            console.log(`[Ollama] Attempt ${retryCount + 1}/${maxRetries + 1} for ${agentToRespond} with model ${modelName}`);

            // Determine if we can attempt a direct connection
            // Direct connection is preferred for https (ngrok) or if running locally
            const isHttps = ollamaEndpoint.startsWith('https://');
            const isLocalHost = typeof window !== 'undefined' &&
              (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

            let response: Response;
            let isDirectConnection = false;

            // Only attempt direct on first try to avoid hanging if blocked
            if ((isHttps || isLocalHost) && retryCount === 0) {
              try {
                console.log(`[Ollama] Attempting direct browser connection to: ${ollamaEndpoint}/api/chat`);
                const directHeaders: Record<string, string> = {
                  'Content-Type': 'application/json',
                };
                if (isHttps) {
                  directHeaders['ngrok-skip-browser-warning'] = 'true';
                }

                // Use AbortSignal.timeout if supported, otherwise a standard controller
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                response = await fetch(`${ollamaEndpoint}/api/chat`, {
                  method: 'POST',
                  headers: directHeaders,
                  body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    stream: true,
                  }),
                  signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                  isDirectConnection = true;
                  console.log(`[Ollama] Direct connection established successfully`);
                } else {
                  throw new Error(`Direct connection returned ${response.status}`);
                }
              } catch (directError) {
                console.warn(`[Ollama] Direct connection failed, falling back to proxy:`, directError);
                // Fallback to proxy
                response = await fetch('/api/ollama/stream', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    ollamaEndpoint: ollamaEndpoint,
                  }),
                });
              }
            } else {
              // Standard proxy connection
              console.log(`[Ollama] Fetching via proxy /api/ollama/stream for model: ${modelName}`);
              response = await fetch('/api/ollama/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: modelName,
                  messages: messages,
                  ollamaEndpoint: ollamaEndpoint,
                }),
              });
            }

            console.log(`[Ollama] Response status: ${response.status} ${response.statusText} (${isDirectConnection ? 'Direct' : 'Proxy'})`);

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`[Ollama] Error response body:`, errorText);
              throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            fullContent = ''; // Reset content for retry
            let buffer = '';

            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) continue;

                  if (isDirectConnection) {
                    // Direct Ollama JSON stream (one JSON object per line)
                    try {
                      const parsed = JSON.parse(trimmedLine);
                      const token = parsed.message?.content || '';
                      if (token) {
                        fullContent += token;
                        await update(rtdbRef, { content: fullContent });
                      }
                      if (parsed.done) {
                        streamSuccess = true;
                        break;
                      }
                    } catch {
                      console.warn(`[Ollama] Failed to parse direct stream line:`, trimmedLine);
                    }
                  } else {
                    // Our proxy's SSE stream (data: {JSON})
                    if (trimmedLine.startsWith('data: ')) {
                      const data = trimmedLine.slice(6);

                      if (data === '[DONE]') {
                        streamSuccess = true;
                        break;
                      }

                      try {
                        const parsed = JSON.parse(data);
                        if (parsed.token) {
                          fullContent += parsed.token;
                          await update(rtdbRef, { content: fullContent });
                        } else if (parsed.error) {
                          throw new Error(`Ollama error: ${parsed.error}`);
                        }
                      } catch (parseError) {
                        if (parseError instanceof Error && parseError.message.startsWith('Ollama error:')) {
                          throw parseError;
                        }
                      }
                    }
                  }
                }
                if (streamSuccess) break;
              }
            }

            // If we got here without errors, we succeeded
            if (streamSuccess) {
              console.log(`[Ollama] Success on attempt ${retryCount + 1}`);
              break;
            }

          } catch (error) {
            console.error(`[Ollama] Attempt ${retryCount + 1} failed:`, error);
            console.error(`[Ollama] Error type:`, error instanceof Error ? error.constructor.name : typeof error);
            console.error(`[Ollama] Error details:`, {
              message: error instanceof Error ? error.message : String(error),
              cause: error instanceof Error ? error.cause : undefined,
              stack: error instanceof Error ? error.stack : undefined,
            });

            // If we have retries left, wait and retry
            if (retryCount < maxRetries) {
              const waitTime = (retryCount + 1) * 2000; // 2s, 4s
              console.log(`[Ollama] Retrying in ${waitTime}ms...`);
              await update(rtdbRef, {
                content: `Retrying (attempt ${retryCount + 2}/${maxRetries + 1})...`,
                status: 'retrying'
              });
              await new Promise(resolve => setTimeout(resolve, waitTime));
              retryCount++;
            } else {
              // No more retries, throw the error
              throw new Error(`Failed after ${maxRetries + 1} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }

        if (!streamSuccess || !fullContent) {
          throw new Error('Stream did not complete successfully');
        }

        // Mark streaming as complete
        await update(rtdbRef, {
          content: fullContent,
          status: 'complete'
        });

        // Save to Firestore using the same messageId as the streaming message
        // This prevents duplicate TTS playback by ensuring the streaming message
        // and Firestore message have the same ID
        await setDoc(doc(db, 'conversations', conversationId, 'messages', messageId), {
          role: agentToRespond,
          content: fullContent,
          timestamp: serverTimestamp(),
          isStreaming: false,
          audioUrl: null, // Will be populated by TTS if enabled
          ttsWasSplit: false,
        });

        // Update conversation state
        const nextTurn = agentToRespond === 'agentA' ? 'agentB' : 'agentA';
        await updateDoc(conversationRef, {
          turn: nextTurn,
          processingLock: false,
          [`${agentToRespond}Processing`]: false,
          lastActivity: serverTimestamp(),
        });

      } catch (error) {
        console.error('Ollama agent error:', error);

        // Clear lock and set error
        await updateDoc(conversationRef, {
          processingLock: false,
          [`${agentToRespond}Processing`]: false,
          status: 'error',
          errorContext: `Error during ${agentToRespond}'s turn: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      } finally {
        processingRef.current = false;
      }
    });

    return () => unsubscribe();
  }, [conversationId, userId]);
}
