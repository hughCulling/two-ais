// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase/clientApp'; // Assuming clientApp exports db
import {
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot, // Keep this for messages
    query,
    orderBy,
    // --- LINT FIX: Import FieldValue for serverTimestamp type ---
    FieldValue,
    serverTimestamp,
    // --- END LINT FIX ---
    Timestamp, // Import Timestamp type
    updateDoc,
    // --- LINT FIX: Removed unused DocumentData import ---
    // DocumentData, // Import DocumentData type
    // --- END LINT FIX ---
    FirestoreError // Import FirestoreError type
} from 'firebase/firestore';
import { Button } from "@/components/ui/button"; // Assuming shadcn Button
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming shadcn ScrollArea
import { AlertCircle } from "lucide-react"; // For error display
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"; // Assuming shadcn Alert

// Define the structure of a message document
interface Message {
    id: string;
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    timestamp: Timestamp | null; // Timestamps read from Firestore are Timestamps
}

// --- NEW: Define structure for conversation document data ---
interface ConversationData {
    userId: string;
    agentA_llm: string;
    agentB_llm: string;
    turn: "agentA" | "agentB";
    status: "running" | "stopped" | "error"; // Add 'error' status
    createdAt: Timestamp; // Read as Timestamp
    lastActivity: Timestamp; // Read as Timestamp
    apiSecretVersions: { [key: string]: string };
    errorContext?: string; // Optional field for error details
}


// Define the props for the ChatInterface component
interface ChatInterfaceProps {
    userId: string;
    agentA_llm: string;
    agentB_llm: string;
    apiSecretVersions: { [key: string]: string };
    initialPrompt?: string;
    onConversationStopped?: () => void;
}

// Basic logger placeholder (replace with actual logging if needed)
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

export function ChatInterface({
    userId,
    agentA_llm,
    agentB_llm,
    apiSecretVersions,
    initialPrompt = "Start the conversation.",
    onConversationStopped
}: ChatInterfaceProps) {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null); // This will now also hold errors from Firestore status
    const [isStopping, setIsStopping] = useState(false);
    const [isStopped, setIsStopped] = useState(false); // Tracks if conversation is stopped (via button or error)
    const [conversationStatus, setConversationStatus] = useState<ConversationData['status'] | null>(null); // Track status locally
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const setupRan = useRef(false);

    // --- DEBUG LOG ---
    useEffect(() => {
        logger.debug(`ChatInterface: conversationId state changed to: ${conversationId}`);
    }, [conversationId]);

    // --- 1. Initiate Conversation ---
    useEffect(() => {
        logger.debug("ChatInterface: Mount/Prop change effect running...");
        if (setupRan.current || conversationId) {
             logger.debug(`ChatInterface: Setup skipped (setupRan: ${setupRan.current}, conversationId: ${conversationId})`);
            return;
        }
        setupRan.current = true;
        logger.debug("ChatInterface: Setup flag set to true.");

        const startConversation = async () => {
             if (!userId || !agentA_llm || !agentB_llm || !apiSecretVersions) {
                 logger.error("startConversation called with missing props.");
                 setError("Missing required configuration to start conversation.");
                 setupRan.current = false;
                 return;
             }
             setError(null); // Clear previous errors on new attempt
             setIsStopped(false); // Reset stopped state
             setConversationStatus(null); // Reset status

             logger.info("Attempting to create conversation in Firestore...");
             try {
                 const newConversationRef = doc(collection(db, "conversations"));
                 const newId = newConversationRef.id;
                 logger.debug(`ChatInterface: Generated new conversation ID: ${newId}`);

                 // --- LINT FIX: Define type correctly using FieldValue for serverTimestamp ---
                 // Type for the object before it's saved, where timestamps are FieldValue
                 type ConversationDataForWrite = Omit<ConversationData, 'createdAt' | 'lastActivity'> & {
                     createdAt: FieldValue;
                     lastActivity: FieldValue;
                 };

                 const conversationData: ConversationDataForWrite = {
                     userId, agentA_llm, agentB_llm, turn: "agentA", status: "running", apiSecretVersions,
                     createdAt: serverTimestamp(), // serverTimestamp() returns FieldValue
                     lastActivity: serverTimestamp() // serverTimestamp() returns FieldValue
                 };
                 // --- END LINT FIX ---

                 await setDoc(newConversationRef, conversationData); // setDoc handles FieldValue correctly
                 logger.info(`Created conversation document: ${newId} with status 'running'`);
                 const initialMessageData = { role: "system", content: initialPrompt, timestamp: serverTimestamp() };
                 await addDoc(collection(db, "conversations", newId, "messages"), initialMessageData);
                 logger.info(`Added initial trigger message for conversation: ${newId}`);
                 logger.debug(`ChatInterface: Calling setConversationId with: ${newId}`);
                 setConversationId(newId); // This triggers the listeners below
                 logger.debug(`ChatInterface: State update setConversationId called.`);
             } catch (err) {
                 logger.error("Error starting conversation:", err);
                  setError(`Failed to start conversation: ${err instanceof Error ? err.message : String(err)}`);
                  setupRan.current = false; // Allow retry maybe?
             }
         };
         startConversation();
         return () => {
             logger.debug("ChatInterface: Mount/Prop change effect cleanup.");
         };
    }, [userId, agentA_llm, agentB_llm, apiSecretVersions, initialPrompt, conversationId]); // conversationId added to prevent potential re-runs if props change mid-session


    // --- 2. Listen for Messages ---
    useEffect(() => {
        logger.debug(`ChatInterface: Message listener effect running. conversationId: ${conversationId}`);
        if (!conversationId) return; // Only run if we have an ID

        logger.info(`ChatInterface: Setting up message listener for conversation: ${conversationId}`);
        const messagesQuery = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery,
            (querySnapshot) => {
                logger.debug(`ChatInterface: Message snapshot received ${querySnapshot.docs.length} docs.`);
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    // --- LINT FIX: Use specific type instead of DocumentData ---
                    const data = doc.data(); // data() returns DocumentData implicitly
                    // --- END LINT FIX ---
                    if (data.role && data.content && data.timestamp) {
                        fetchedMessages.push({
                            id: doc.id,
                            role: data.role,
                            content: data.content,
                            timestamp: data.timestamp // Firestore Timestamps are handled correctly
                        } as Message);
                    } else {
                        logger.warn(`Skipping message doc ${doc.id} due to missing fields.`);
                    }
                });
                setMessages(fetchedMessages);
                // Don't clear error here, let the status listener handle it
                // setError(null);
            },
            (err: FirestoreError) => {
                 logger.error(`Error listening to messages for conversation ${conversationId}:`, err);
                 setError(`Failed to load messages: ${err.message}`); // Show message loading error
            }
        );

        // Cleanup listener
        return () => {
            logger.info(`ChatInterface: Cleaning up message listener for conversation: ${conversationId}`);
            unsubscribe();
        };

    }, [conversationId]); // Re-run only if conversationId changes


    // --- NEW: Listen for Conversation Status Changes ---
    useEffect(() => {
        logger.debug(`ChatInterface: Status listener effect running. conversationId: ${conversationId}`);
        if (!conversationId) return; // Only run if we have an ID

        logger.info(`ChatInterface: Setting up status listener for conversation: ${conversationId}`);
        const conversationDocRef = doc(db, "conversations", conversationId);

        const unsubscribeStatus = onSnapshot(conversationDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    // Cast directly to ConversationData when reading
                    const data = docSnap.data() as ConversationData;
                    logger.debug(`ChatInterface: Status snapshot received. Status: ${data.status}, ErrorContext: ${data.errorContext}`);
                    setConversationStatus(data.status); // Update local status tracker

                    if (data.status === "error") {
                        // Set the error state to display in the UI
                        const errorMsg = data.errorContext
                            ? `Conversation Error: ${data.errorContext}`
                            : "An unknown error occurred in the conversation.";
                        setError(errorMsg);
                        setIsStopped(true); // Mark as stopped due to error
                        logger.warn(`Conversation ${conversationId} entered error state: ${errorMsg}`);
                    } else if (data.status === "stopped") {
                        setIsStopped(true); // Mark as stopped if status changes to stopped
                        // Clear only conversation-related errors if manually stopped
                        if (error && error.startsWith("Conversation Error:")) {
                             setError(null);
                        }
                        logger.info(`Conversation ${conversationId} status changed to 'stopped'.`);
                    } else if (data.status === "running") {
                        // Clear conversation-related errors if it becomes running again
                         if (error && error.startsWith("Conversation Error:")) {
                             setError(null);
                         }
                         setIsStopped(false);
                    }
                } else {
                    logger.warn(`Conversation document ${conversationId} does not exist in status listener.`);
                    setError("Conversation data not found.");
                    setIsStopped(true);
                }
            },
            (err: FirestoreError) => {
                logger.error(`Error listening to conversation status for ${conversationId}:`, err);
                setError(`Failed to get conversation status: ${err.message}`);
                setIsStopped(true); // Assume stopped if we can't read status
            }
        );

        // Cleanup status listener
        return () => {
            logger.info(`ChatInterface: Cleaning up status listener for conversation: ${conversationId}`);
            unsubscribeStatus();
        };

    }, [conversationId, error]); // Keep 'error' dependency? Maybe remove if clearing logic is robust. Let's keep for now.


    // --- Auto-scroll ---
    useEffect(() => {
        // Scroll only if the conversation is actively running and not stopped/errored
        if (conversationStatus === "running" && !isStopped) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            if (messagesEndRef.current) {
                logger.debug("Attempted smooth scroll to messagesEndRef.");
            } else {
                logger.debug("messagesEndRef not available for scrolling yet.");
            }
        } else {
             logger.debug(`Skipping scroll. Status: ${conversationStatus}, isStopped: ${isStopped}`);
        }
    // Depend on messages AND the conversation status
    }, [messages, conversationStatus, isStopped]);


    // --- Stop Conversation Handler ---
    const handleStopConversation = useCallback(async () => {
        // Prevent stopping if already stopping, stopped, or no ID
        if (!conversationId || isStopping || isStopped) return;

        setIsStopping(true);
        // Don't clear error here, maybe the user wants to see the error before stopping
        // setError(null);
        logger.info(`Attempting to stop conversation: ${conversationId}`);
        try {
            const conversationRef = doc(db, "conversations", conversationId);
            // Update Firestore status to "stopped"
            await updateDoc(conversationRef, {
                status: "stopped",
                lastActivity: serverTimestamp()
                // Optionally clear errorContext if manually stopping
                // errorContext: deleteField() // Requires importing deleteField
            });
            logger.info(`Conversation ${conversationId} status set to stopped via button.`);
            // No need to setIsStopped(true) here, the status listener will handle it
            if (onConversationStopped) {
                onConversationStopped(); // Call parent callback if provided
            }
        } catch (err) {
            logger.error(`Error stopping conversation ${conversationId}:`, err);
            // Show error specific to the stop action
            setError(`Failed to stop conversation: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsStopping(false); // Reset stopping indicator
        }
    }, [conversationId, isStopping, isStopped, onConversationStopped]); // Removed 'error' from deps


    // --- Render Logic ---
    logger.debug(`ChatInterface: Rendering. Status: ${conversationStatus}, isStopped: ${isStopped}, Error: ${error}, Messages: ${messages.length}`);

    // Display error if present (could be from init, message loading, status update, or stop action)
    if (error) {
        return (
             <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
               {isStopped && onConversationStopped && (
                   <Button variant="outline" size="sm" className="mt-2" onClick={onConversationStopped}>
                       Go Back
                   </Button>
               )}
            </Alert>
        );
    }

    // Initializing state
    if (!conversationId || (!conversationStatus && !error)) {
        return <div className="p-4 text-center">Initializing conversation...</div>;
    }

    // Main chat interface render
    return (
        <div className="flex flex-col h-[70vh] w-full p-4 bg-background rounded-lg shadow-md border overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b">
                <h2 className="text-lg font-semibold">AI Conversation</h2>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopConversation}
                    // Disable button if stopping in progress OR if already stopped (via button or error)
                    disabled={isStopping || isStopped}
                >
                    {isStopped ? "Stopped" : (isStopping ? "Stopping..." : "Stop Conversation")}
                </Button>
            </div>
             {/* Scroll Area */}
             <ScrollArea className="flex-grow min-h-0 mb-4 pr-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.role === 'agentA' ? 'justify-start' :
                                msg.role === 'agentB' ? 'justify-end' :
                                'justify-center text-xs text-muted-foreground italic'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm ${
                                    msg.role === 'agentA' ? 'bg-muted text-foreground' :
                                    msg.role === 'agentB' ? 'bg-primary text-primary-foreground' :
                                    'bg-transparent px-0 py-1'
                                }`}
                            >
                                {msg.role === 'agentA' || msg.role === 'agentB' ? (
                                     <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
                                ) : null }
                                {msg.content}
                            </div>
                        </div>
                    ))}
                     {/* Show waiting message only if running and no messages yet */}
                     {conversationStatus === "running" && messages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm p-4">Waiting for first message...</div>
                     )}
                     {/* Show indicator if stopped cleanly */}
                      {isStopped && conversationStatus === "stopped" && !error && (
                         <div className="text-center text-muted-foreground text-sm p-4">Conversation stopped.</div>
                      )}
                     <div ref={messagesEndRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
