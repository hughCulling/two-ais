// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase/clientApp'; // Client-side SDK for stop button
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp, // Still used for updateDoc
    Timestamp,
    updateDoc, // Used by stop button
    FirestoreError
} from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// --- Interfaces ---
interface Message {
    id: string;
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    timestamp: Timestamp | null;
}

interface ConversationData {
    userId: string;
    agentA_llm: string;
    agentB_llm: string;
    turn: "agentA" | "agentB";
    status: "running" | "stopped" | "error";
    createdAt: Timestamp;
    lastActivity: Timestamp;
    apiSecretVersions: { [key: string]: string };
    errorContext?: string;
}

// --- Component Props ---
// Props interface now only includes what the component actually uses internally
interface ChatInterfaceProps {
    conversationId: string; // ID is now passed as a prop
    onConversationStopped: () => void; // Callback when conversation stops or user wants to go back
}

// Basic logger placeholder
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

export function ChatInterface({
    // Destructure only the needed props
    conversationId,
    onConversationStopped
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [technicalErrorDetails, setTechnicalErrorDetails] = useState<string | null>(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [isStopping, setIsStopping] = useState(false); // Tracks if the stop *button* action is in progress
    const [isStopped, setIsStopped] = useState(false); // Tracks if the conversation is *actually* stopped (via status listener or error)
    const [conversationStatus, setConversationStatus] = useState<ConversationData['status'] | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Effect 1: Listen for Messages ---
    useEffect(() => {
        logger.debug(`ChatInterface: Message listener effect running. conversationId prop: ${conversationId}`);
        if (!conversationId) {
            logger.warn("ChatInterface: Message listener effect skipped - no conversationId prop.");
            return;
        }

        logger.info(`ChatInterface: Setting up message listener for conversation: ${conversationId}`);
        const messagesQuery = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery,
            (querySnapshot) => {
                logger.debug(`ChatInterface: Message snapshot received ${querySnapshot.docs.length} docs for ${conversationId}.`);
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.role && data.content && data.timestamp) {
                        fetchedMessages.push({
                            id: doc.id,
                            role: data.role,
                            content: data.content,
                            timestamp: data.timestamp
                        } as Message);
                    } else {
                        logger.warn(`Skipping message doc ${doc.id} due to missing fields.`);
                    }
                });
                setMessages(fetchedMessages);
            },
            (err: FirestoreError) => {
                 logger.error(`Error listening to messages for conversation ${conversationId}:`, err);
                 setError(`Failed to load messages: ${err.message}`);
                 setTechnicalErrorDetails(null);
            }
        );
        return () => {
            logger.info(`ChatInterface: Cleaning up message listener for conversation: ${conversationId}`);
            unsubscribe();
        };
    }, [conversationId]); // Depend only on conversationId


    // --- Effect 2: Listen for Conversation Status Changes ---
    useEffect(() => {
        logger.debug(`ChatInterface: Status listener effect running. conversationId prop: ${conversationId}`);
        if (!conversationId) {
             logger.warn("ChatInterface: Status listener effect skipped - no conversationId prop.");
            return;
        }

        logger.info(`ChatInterface: Setting up status listener for conversation: ${conversationId}`);
        const conversationDocRef = doc(db, "conversations", conversationId);

        const unsubscribeStatus = onSnapshot(conversationDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as ConversationData;
                    logger.debug(`ChatInterface: Status snapshot received for ${conversationId}. Status: ${data.status}, ErrorContext: ${data.errorContext}`);
                    const newStatus = data.status;
                    setConversationStatus(newStatus); // Update local status state

                    if (newStatus === "error") {
                        const fullErrorContext = data.errorContext || "An unknown error occurred in the conversation.";
                        const errorPrefix = "Conversation Error: ";
                        const technicalSeparator = ". Error: ";
                        let userFriendlyError = fullErrorContext;
                        let techDetails: string | null = null;

                        if (fullErrorContext.startsWith(errorPrefix)) {
                            userFriendlyError = fullErrorContext.substring(errorPrefix.length);
                        }
                        const techIndex = userFriendlyError.indexOf(technicalSeparator);
                        if (techIndex !== -1) {
                            techDetails = userFriendlyError.substring(techIndex + technicalSeparator.length);
                            userFriendlyError = userFriendlyError.substring(0, techIndex + 1);
                        } else {
                             techDetails = null;
                        }

                        setError(errorPrefix + userFriendlyError);
                        setTechnicalErrorDetails(techDetails);
                        setShowErrorDetails(false);
                        setIsStopped(true); // Error means stopped
                        logger.warn(`Conversation ${conversationId} entered error state: ${userFriendlyError}`);
                    } else if (newStatus === "stopped") {
                        setIsStopped(true); // Mark as stopped locally
                        if (error && conversationStatus !== 'error') { // Clear non-critical errors if stopped cleanly
                             setError(null);
                             setTechnicalErrorDetails(null);
                        }
                        logger.info(`Conversation ${conversationId} status changed to 'stopped'.`);
                    } else if (newStatus === "running") {
                         // If it becomes running again, clear errors and stopped state
                         // Check current 'isStopped' state before clearing
                         if (error || isStopped) {
                             setError(null);
                             setTechnicalErrorDetails(null);
                             setIsStopped(false); // Explicitly set back to not stopped
                         }
                         logger.info(`Conversation ${conversationId} status changed to 'running'.`);
                    }
                } else {
                    logger.warn(`Conversation document ${conversationId} does not exist in status listener.`);
                    setError("Conversation data not found. It might have been deleted.");
                    setTechnicalErrorDetails(null);
                    setIsStopped(true);
                }
            },
            (err: FirestoreError) => {
                logger.error(`Error listening to conversation status for ${conversationId}:`, err);
                setError(`Failed to get conversation status: ${err.message}`);
                setTechnicalErrorDetails(null);
                setIsStopped(true);
            }
        );
        return () => {
            logger.info(`ChatInterface: Cleaning up status listener for conversation: ${conversationId}`);
            unsubscribeStatus();
        };
    // --- FIX: Added 'isStopped' to dependency array ---
    // The effect reads 'isStopped' when transitioning to 'running', so it needs to be a dependency.
    }, [conversationId, error, conversationStatus, isStopped]);


    // --- Effect 3: Auto-scroll ---
    useEffect(() => {
        // Only scroll when running and not locally marked as stopped
        if (conversationStatus === "running" && !isStopped) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages, conversationStatus, isStopped]); // Dependencies are correct here


    // --- Handler 4: Stop Conversation ---
    const handleStopConversation = useCallback(async () => {
        logger.debug(`handleStopConversation called. Conversation ID prop: ${conversationId}`);
        // Prevent stopping if no ID, already stopping, or already confirmed stopped
        if (!conversationId || isStopping || isStopped) {
            logger.warn(`Stop conversation skipped. ID: ${conversationId}, Stopping: ${isStopping}, Stopped: ${isStopped}`);
            return;
        }

        setIsStopping(true); // Indicate button action start
        logger.info(`Attempting to stop conversation via button: ${conversationId}`);
        try {
            const conversationRef = doc(db, "conversations", conversationId);
            await updateDoc(conversationRef, {
                status: "stopped",
                lastActivity: serverTimestamp()
            });
            logger.info(`Client-side updateDoc call successful for conversation ${conversationId} status to 'stopped'.`);
            // The status listener (Effect 2) will handle setting isStopped = true eventually.
            // Call the parent callback immediately after successful update.
            if (onConversationStopped) {
                onConversationStopped();
            }
        } catch (err) {
            logger.error(`Error stopping conversation ${conversationId} via client-side update:`, err);
            setError(`Failed to stop conversation: ${err instanceof Error ? err.message : String(err)}`);
            setTechnicalErrorDetails(null);
            // Don't call onConversationStopped here on error, let user use Go Back button in error state
        } finally {
            setIsStopping(false); // Reset button action indicator regardless of success/failure
        }
    }, [conversationId, isStopping, isStopped, onConversationStopped]); // Dependencies for useCallback


    // --- Render Logic ---

    // --- A. Error Display ---
    if (error) {
        return (
             <Alert variant="destructive" className="w-full max-w-2xl mx-auto my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm break-words whitespace-pre-wrap">
                {error}
              </AlertDescription>

              <div className="mt-4 flex flex-col items-start space-y-3">
                  {technicalErrorDetails && (
                      <div className="w-full">
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowErrorDetails(!showErrorDetails)}
                              className="text-xs h-6 px-2"
                          >
                              {showErrorDetails ? 'Hide Details' : 'Show Details'}
                              {showErrorDetails ? <ChevronUp className="ml-1 h-3 w-3"/> : <ChevronDown className="ml-1 h-3 w-3"/>}
                          </Button>
                          {showErrorDetails && (
                              <pre className="mt-1 text-xs whitespace-pre-wrap break-words overflow-auto max-h-32 rounded-md border bg-muted p-2 font-mono w-full min-w-0">
                                  {technicalErrorDetails}
                              </pre>
                          )}
                      </div>
                  )}
                  {/* Show Go Back button if conversation is stopped (due to error) AND callback exists */}
                  {isStopped && onConversationStopped && (
                       <div>
                           <Button
                               variant="outline"
                               size="sm"
                               onClick={onConversationStopped} // Use the callback to navigate away
                            >
                               Go Back
                           </Button>
                       </div>
                  )}
              </div>
            </Alert>
        );
    }
    // --- B. Initializing State Display ---
    if (!conversationId) {
        return <div className="p-4 text-center text-muted-foreground">Initializing session...</div>;
    }
     if (!conversationStatus && !error) { // Added !error check
        return <div className="p-4 text-center text-muted-foreground">Loading conversation status...</div>;
    }


    // --- C. Main Chat Interface Render ---
    return (
        <div className="flex flex-col h-[70vh] w-full max-w-3xl mx-auto p-4 bg-background rounded-lg shadow-md border overflow-hidden">
            {/* Header Section */}
            <div className="flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b">
                <h2 className="text-lg font-semibold">AI Conversation</h2>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopConversation}
                    // Disable button if stop action is in progress OR if conversation is confirmed stopped
                    disabled={isStopping || isStopped}
                >
                    {isStopped ? "Stopped" : (isStopping ? "Stopping..." : "Stop Conversation")}
                </Button>
            </div>

             {/* Scrollable Message Area */}
             <ScrollArea className="flex-grow min-h-0 mb-4 pr-4 -mr-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.role === 'agentA' ? 'justify-start' :
                                msg.role === 'agentB' ? 'justify-end' :
                                'justify-center text-xs text-muted-foreground italic py-1'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm ${
                                    msg.role === 'agentA' ? 'bg-muted text-foreground' :
                                    msg.role === 'agentB' ? 'bg-primary text-primary-foreground' :
                                    'bg-transparent px-0 py-0 shadow-none'
                                }`}
                            >
                                {msg.role === 'agentA' || msg.role === 'agentB' ? (
                                     <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
                                ) : null }
                                {msg.content}
                            </div>
                        </div>
                    ))}
                     {conversationStatus === "running" && messages.length === 0 && !isStopped && (
                        <div className="text-center text-muted-foreground text-sm p-4">Waiting for first message...</div>
                     )}
                      {/* Show stopped message only if cleanly stopped (status is 'stopped') */}
                      {isStopped && conversationStatus === "stopped" && !error && (
                         <div className="text-center text-muted-foreground text-sm p-4">Conversation stopped.</div>
                      )}
                     <div ref={messagesEndRef} />
                </div>
            </ScrollArea>
        </div>
    );
}

