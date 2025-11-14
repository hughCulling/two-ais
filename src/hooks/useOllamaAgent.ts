// src/hooks/useOllamaAgent.ts
// Client-side hook to handle Ollama model responses locally
// This bypasses Firebase Functions for local Ollama models

import { useEffect, useRef } from 'react';
import { doc, collection, onSnapshot, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, rtdb } from '@/lib/firebase/clientApp';
import { ref, set, update } from 'firebase/database';

interface Message {
  role: string;
  content: string;
  timestamp: any;
}

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
        data.turn &&
        (data.agentA_llm?.startsWith('ollama:') || data.agentB_llm?.startsWith('ollama:'));

      if (!shouldRespond || processingRef.current) return;

      const agentToRespond = data.turn;
      const agentModelId = agentToRespond === 'agentA' ? data.agentA_llm : data.agentB_llm;

      // Only handle if this agent uses Ollama
      if (!agentModelId?.startsWith('ollama:')) return;

      processingRef.current = true;

      try {
        // Set processing lock
        await updateDoc(conversationRef, {
          processingLock: true,
          [`${agentToRespond}Processing`]: true,
        });

        // Get conversation history
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const messagesSnapshot = await getDoc(doc(db, 'conversations', conversationId));
        const historyQuery = collection(db, 'conversations', conversationId, 'messages');
        
        // Fetch recent messages for context
        const { getDocs, query, orderBy, limit } = await import('firebase/firestore');
        const historySnap = await getDocs(query(historyQuery, orderBy('timestamp', 'asc'), limit(20)));
        
        const messages = historySnap.docs.map(doc => {
          const data = doc.data();
          return {
            role: data.role === agentToRespond ? 'assistant' : 
                  data.role === 'system' ? 'system' : 'user',
            content: data.content,
          };
        });

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

        // Stream from local Ollama via our API route
        const response = await fetch('/api/ollama/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            messages: messages,
            ollamaEndpoint: ollamaEndpoint,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.token) {
                    fullContent += parsed.token;
                    await update(rtdbRef, { content: fullContent });
                  } else if (parsed.error) {
                    throw new Error(parsed.error);
                  }
                } catch (e) {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }
        }

        // Mark streaming as complete
        await update(rtdbRef, { 
          content: fullContent, 
          status: 'complete' 
        });

        // Save to Firestore
        await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
          role: agentToRespond,
          content: fullContent,
          timestamp: serverTimestamp(),
          streamingMessageId: messageId,
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
