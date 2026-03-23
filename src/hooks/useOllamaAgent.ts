// src/hooks/useOllamaAgent.ts
// Client-side hook to handle Ollama model responses locally
// This bypasses Firebase Functions for local Ollama models

import { useEffect, useRef } from 'react';
import { doc, collection, onSnapshot, updateDoc, setDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db, rtdb } from '@/lib/firebase/clientApp';
import { ref, set, update } from 'firebase/database';

export function useOllamaAgent(conversationId: string | null, userId: string | null) {
  const processingRef = useRef(false);
  const NATURAL_STOP_MESSAGE = 'System: Conversation ended naturally because a model returned an empty response.';
  const DEFERRED_STOP_MESSAGE = 'System: Conversation will stop after queued messages finish because a background generation failed.';

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
      let agentMessagesAheadForAttempt = 0;

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
        const effectiveLookaheadLimit = data.lookaheadLimit ?? 3;
        const { getDocs, query: firestoreQuery, orderBy: firestoreOrderBy, limit: firestoreLimit } = await import('firebase/firestore');
        let agentMessagesAhead: number | null = null;
        let agentMessageCount: number | null = null;
        let lastPlayedAgentIndex: number | null = null;

        if (typeof data.agentMessageCount === 'number' && typeof data.lastPlayedAgentIndex === 'number') {
          agentMessageCount = data.agentMessageCount;
          lastPlayedAgentIndex = data.lastPlayedAgentIndex;
          agentMessagesAhead = Math.max(0, agentMessageCount - lastPlayedAgentIndex);
        } else {
          const messagesQuery = firestoreQuery(
            collection(db, 'conversations', conversationId, 'messages'),
            firestoreOrderBy('timestamp', 'asc')
          );
          const allMessagesSnap = await getDocs(messagesQuery);
          let runningAgentCount = 0;
          let computedLastPlayedIndex = 0;
          for (const messageDoc of allMessagesSnap.docs) {
            const role = messageDoc.data().role;
            if (role !== 'agentA' && role !== 'agentB') continue;
            runningAgentCount += 1;
            if (data.lastPlayedAgentMessageId && messageDoc.id === data.lastPlayedAgentMessageId) {
              computedLastPlayedIndex = runningAgentCount;
            }
          }
          agentMessageCount = runningAgentCount;
          lastPlayedAgentIndex = computedLastPlayedIndex;
          agentMessagesAhead = Math.max(0, runningAgentCount - computedLastPlayedIndex);
          try {
            await updateDoc(conversationRef, {
              agentMessageCount: runningAgentCount,
              lastPlayedAgentIndex: computedLastPlayedIndex,
            });
          } catch (error) {
            console.warn('[Ollama Lookahead] Failed to update cached counters:', error);
          }
        }
        agentMessagesAheadForAttempt = agentMessagesAhead ?? 0;

        if (agentMessagesAhead >= effectiveLookaheadLimit) {
          console.log(`[Ollama Lookahead] ${agentMessagesAhead} messages ahead. Limit is ${effectiveLookaheadLimit}. Skipping.`);
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

        // Stream from local Ollama via our API route with retry logic
        let fullContent = '';
        let retryCount = 0;
        const maxRetries = 2;
        let streamSuccess = false;
        
        while (retryCount <= maxRetries && !streamSuccess) {
          try {
            console.log(`[Ollama] Attempt ${retryCount + 1}/${maxRetries + 1} for ${agentToRespond} with model ${modelName}`);
            
            console.log(`[Ollama] Fetching from /api/ollama/stream with model: ${modelName}, endpoint: ${ollamaEndpoint}`);
            
            const response = await fetch('/api/ollama/stream', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: modelName,
                messages: messages,
                ollamaEndpoint: ollamaEndpoint,
              }),
            });

            console.log(`[Ollama] Response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`[Ollama] Error response body:`, errorText);
              throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            fullContent = ''; // Reset content for retry

            if (reader) {
              let buffer = '';

              while (true) {
                const { done, value } = await reader.read();
                if (value) {
                  buffer += decoder.decode(value, { stream: !done });
                } else if (done) {
                  // Flush decoder state in case the final chunk ended mid-codepoint.
                  buffer += decoder.decode();
                }

                const lines = buffer.split('\n');
                buffer = done ? '' : (lines.pop() || '');

                for (const line of lines) {
                  if (!line.startsWith('data: ')) continue;
                  const data = line.slice(6);
                  
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
                      // Error in stream - throw to trigger retry
                      throw new Error(`Ollama error: ${parsed.error}`);
                    }
                  } catch (parseError) {
                    // If it's an error object, rethrow it
                    if (parseError instanceof Error && parseError.message.startsWith('Ollama error:')) {
                      throw parseError;
                    }
                    // Otherwise ignore parse errors for incomplete chunks
                  }
                }
                
                if (streamSuccess || done) break;
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

        if (!streamSuccess) {
          throw new Error('Stream did not complete successfully');
        }

        if (!fullContent.trim()) {
          const shouldDeferStopUntilPlayback = Boolean(data.ttsSettings?.enabled) && agentMessagesAheadForAttempt > 0;

          await update(rtdbRef, {
            content: '',
            status: 'complete'
          });

          if (shouldDeferStopUntilPlayback) {
            await updateDoc(conversationRef, {
              processingLock: false,
              [`${agentToRespond}Processing`]: false,
              waitingForTTSEndSignal: true,
              autoStopPending: true,
              autoStopMessage: NATURAL_STOP_MESSAGE,
              lastActivity: serverTimestamp(),
            });
          } else {
            await updateDoc(conversationRef, {
              status: 'stopped',
              processingLock: false,
              [`${agentToRespond}Processing`]: false,
              waitingForTTSEndSignal: false,
              autoStopPending: false,
              autoStopMessage: NATURAL_STOP_MESSAGE,
              lastActivity: serverTimestamp(),
            });
          }
          return;
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
          waitingForTTSEndSignal: false,
          autoStopPending: false,
          autoStopMessage: '',
          lastActivity: serverTimestamp(),
          agentMessageCount: increment(1),
        });

      } catch (error) {
        console.error('Ollama agent error:', error);
        const errorMessage = `Error during ${agentToRespond}'s turn: ${error instanceof Error ? error.message : 'Unknown error'}`;
        const shouldDeferStopUntilPlayback = Boolean(data.ttsSettings?.enabled) && agentMessagesAheadForAttempt > 0;

        if (shouldDeferStopUntilPlayback) {
          await updateDoc(conversationRef, {
            processingLock: false,
            [`${agentToRespond}Processing`]: false,
            waitingForTTSEndSignal: true,
            autoStopPending: true,
            autoStopMessage: DEFERRED_STOP_MESSAGE,
            deferredErrorContext: errorMessage,
            lastActivity: serverTimestamp(),
          });
        } else {
          // Foreground failure: keep existing error behavior
          await updateDoc(conversationRef, {
            processingLock: false,
            [`${agentToRespond}Processing`]: false,
            status: 'error',
            errorContext: errorMessage,
          });
        }
      } finally {
        processingRef.current = false;
      }
    });

    return () => unsubscribe();
  }, [conversationId, userId]);
}
