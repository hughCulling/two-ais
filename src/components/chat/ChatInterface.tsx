// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase/clientApp'; // Client-side SDK for stop button
import {
    collection,
    doc,
    // setDoc, // No longer used here
    // addDoc, // No longer used here
    onSnapshot,
    query,
    orderBy,
    // FieldValue, // No longer used here
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
interface ChatInterfaceProps {
    // Removed unused props from the interface if they are truly not needed anywhere
    // If they might be needed later, keep them here but remove from destructuring below
    // userId: string;
    // agentA_llm: string; // Backend ID
    // agentB_llm: string; // Backend ID
    // apiSecretVersions: { [key: string]: string };

    conversationId: string; // ID is now passed as a prop
    onConversationStopped: () => void; // Renamed for clarity
}

// Basic logger placeholder
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

export function ChatInterface({
    // --- FIX: Removed unused variables from destructuring ---
    // userId,
    // agentA_llm,
    // agentB_llm,
    // apiSecretVersions,
    // --- End Fix ---
    conversationId, // Use the passed-in conversation ID
    onConversationStopped
}: ChatInterfaceProps) {
    // Removed internal conversationId state - use the prop instead
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [technicalErrorDetails, setTechnicalErrorDetails] = useState<string | null>(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [isStopped, setIsStopped] = useState(false); // Still track local stopped state based on status listener
    const [conversationStatus, setConversationStatus] = useState<ConversationData['status'] | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Removed setupRan ref - no longer needed as creation logic is removed

    // --- REMOVED Effect 1: Initiate Conversation ---
    // The conversation document and initial message are now created by the
    // /api/conversation/start API route before this component mounts.

    // --- Effect 2: Listen for Messages ---
    useEffect(() => {
        logger.debug(`ChatInterface: Message listener effect running. conversationId prop: ${conversationId}`);
        // Only run if a valid conversationId prop is provided
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
                    // Basic validation to prevent errors if Firestore data is incomplete
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
                 setTechnicalErrorDetails(null); // Clear technical details on new error
            }
        );
        // Cleanup listener when conversationId changes or component unmounts
        return () => {
            logger.info(`ChatInterface: Cleaning up message listener for conversation: ${conversationId}`);
            unsubscribe();
        };
    // Depend only on the conversationId prop
    }, [conversationId]);


    // --- Effect 3: Listen for Conversation Status Changes ---
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
                    const data = docSnap.data() as ConversationData; // Assume ConversationData structure
                    logger.debug(`ChatInterface: Status snapshot received for ${conversationId}. Status: ${data.status}, ErrorContext: ${data.errorContext}`);
                    const newStatus = data.status;
                    setConversationStatus(newStatus); // Update local status state

                    // Handle status changes
                    if (newStatus === "error") {
                        const fullErrorContext = data.errorContext || "An unknown error occurred in the conversation.";
                        const errorPrefix = "Conversation Error: ";
                        const technicalSeparator = ". Error: ";
                        let userFriendlyError = fullErrorContext;
                        let techDetails: string | null = null;

                        // Extract user-friendly part and technical details if possible
                        if (fullErrorContext.startsWith(errorPrefix)) {
                            userFriendlyError = fullErrorContext.substring(errorPrefix.length);
                        }
                        const techIndex = userFriendlyError.indexOf(technicalSeparator);
                        if (techIndex !== -1) {
                            techDetails = userFriendlyError.substring(techIndex + technicalSeparator.length);
                            userFriendlyError = userFriendlyError.substring(0, techIndex + 1); // Include the period
                        } else {
                             techDetails = null; // No technical details found
                        }

                        setError(errorPrefix + userFriendlyError); // Set the combined error message
                        setTechnicalErrorDetails(techDetails); // Set technical details separately
                        setShowErrorDetails(false); // Reset details view on new error
                        setIsStopped(true); // Error means stopped
                        logger.warn(`Conversation ${conversationId} entered error state: ${userFriendlyError}`);
                    } else if (newStatus === "stopped") {
                        setIsStopped(true); // Mark as stopped locally
                        // Clear previous errors ONLY if it was stopped cleanly (not an error state)
                        if (error && conversationStatus !== 'error') {
                             setError(null);
                             setTechnicalErrorDetails(null);
                        }
                        logger.info(`Conversation ${conversationId} status changed to 'stopped'.`);
                    } else if (newStatus === "running") {
                        // If it becomes running again, clear errors and stopped state
                         if (error || isStopped) { // Clear if previously errored or stopped
                             setError(null);
                             setTechnicalErrorDetails(null);
                             setIsStopped(false);
                         }
                         logger.info(`Conversation ${conversationId} status changed to 'running'.`);
                    }
                } else {
                    // Handle case where conversation doc disappears unexpectedly
                    logger.warn(`Conversation document ${conversationId} does not exist in status listener.`);
                    setError("Conversation data not found. It might have been deleted.");
                    setTechnicalErrorDetails(null);
                    setIsStopped(true); // Treat as stopped/error
                }
            },
            (err: FirestoreError) => {
                logger.error(`Error listening to conversation status for ${conversationId}:`, err);
                setError(`Failed to get conversation status: ${err.message}`);
                setTechnicalErrorDetails(null);
                setIsStopped(true); // Treat as stopped/error
            }
        );
        // Cleanup listener
        return () => {
            logger.info(`ChatInterface: Cleaning up status listener for conversation: ${conversationId}`);
            unsubscribeStatus();
        };
    // Depend on conversationId, error state (to clear errors), and current conversationStatus (to detect transitions)
    }, [conversationId, error, conversationStatus]); // Added conversationStatus


    // --- Effect 4: Auto-scroll ---
    useEffect(() => {
        // Only scroll when running and not locally marked as stopped
        if (conversationStatus === "running" && !isStopped) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            // logger.debug("Attempted smooth scroll to messagesEndRef."); // Less verbose logging
        } else {
             // logger.debug(`Skipping scroll. Status: ${conversationStatus}, isStopped: ${isStopped}`);
        }
    // Depend on messages array, status, and stopped state
    }, [messages, conversationStatus, isStopped]);


    // --- Handler 5: Stop Conversation ---
    const handleStopConversation = useCallback(async () => {
        // --- DEBUG: Log the conversationId being used ---
        logger.debug(`handleStopConversation called. Conversation ID prop: ${conversationId}`);

        // Check if we have an ID and aren't already stopping/stopped
        if (!conversationId || isStopping || isStopped) {
            logger.warn(`Stop conversation skipped. ID: ${conversationId}, Stopping: ${isStopping}, Stopped: ${isStopped}`);
            return;
        }

        setIsStopping(true); // Indicate process start
        logger.info(`Attempting to stop conversation via button: ${conversationId}`);
        try {
            // Get reference to the conversation document using the client SDK
            const conversationRef = doc(db, "conversations", conversationId);
            // Update the status field to 'stopped'
            await updateDoc(conversationRef, {
                status: "stopped",
                lastActivity: serverTimestamp() // Update activity timestamp
            });
            logger.info(`Client-side updateDoc call successful for conversation ${conversationId} status to 'stopped'.`);
            // Note: The status listener above will eventually set isStopped=true

            // Call the callback provided by the parent component (page.tsx)
            if (onConversationStopped) {
                onConversationStopped();
            }
        } catch (err) {
            // Log and potentially display error if update fails
            logger.error(`Error stopping conversation ${conversationId} via client-side update:`, err);
            // Set local error state to inform user
            setError(`Failed to stop conversation: ${err instanceof Error ? err.message : String(err)}`);
            setTechnicalErrorDetails(null); // No specific tech details here
        } finally {
            setIsStopping(false); // Reset stopping indicator
        }
    // Dependencies for useCallback
    }, [conversationId, isStopping, isStopped, onConversationStopped]);


    // --- Render Logic ---
    // logger.debug(`ChatInterface: Rendering. Status: ${conversationStatus}, isStopped: ${isStopped}, Error: ${error}, Messages: ${messages.length}`);

    // --- A. Error Display ---
    if (error) {
        // logger.debug("Rendering Error Alert. Technical Details State:", technicalErrorDetails);
        return (
             <Alert variant="destructive" className="w-full max-w-2xl mx-auto my-4"> {/* Added max-width and centering */}
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm break-words whitespace-pre-wrap">
                {error}
              </AlertDescription>

              <div className="mt-4 flex flex-col items-start space-y-3">
                  {technicalErrorDetails && (
                      <div className="w-full"> {/* Apply w-full to container div */}
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

                  {/* Show Go Back button if conversation is stopped (locally) AND callback exists */}
                  {/* This allows going back even if Firestore update failed but listener caught 'error' status */}
                  {isStopped && onConversationStopped && (
                       <div>
                           <Button
                               variant="outline"
                               className="px-4" // Removed h-8 for default height
                               size="sm" // Use standard small size
                               onClick={onConversationStopped}
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
    // Show initializing if we don't have a conversation ID prop yet
    if (!conversationId) {
        return <div className="p-4 text-center text-muted-foreground">Initializing session...</div>;
    }
    // Or if status hasn't loaded yet (and no error occurred)
     if (!conversationStatus && !error) {
        return <div className="p-4 text-center text-muted-foreground">Loading conversation status...</div>;
    }


    // --- C. Main Chat Interface Render ---
    return (
        <div className="flex flex-col h-[70vh] w-full max-w-3xl mx-auto p-4 bg-background rounded-lg shadow-md border overflow-hidden"> {/* Added max-width and centering */}
            {/* Header Section */}
            <div className="flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b">
                <h2 className="text-lg font-semibold">AI Conversation</h2>
                {/* Stop Button */}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopConversation}
                    // Disable button if stopping process is ongoing OR if locally marked as stopped
                    disabled={isStopping || isStopped}
                >
                    {/* Change button text based on state */}
                    {isStopped ? "Stopped" : (isStopping ? "Stopping..." : "Stop Conversation")}
                </Button>
            </div>

             {/* Scrollable Message Area */}
             <ScrollArea className="flex-grow min-h-0 mb-4 pr-4 -mr-4"> {/* Adjust padding/margin for scrollbar */}
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.role === 'agentA' ? 'justify-start' :
                                msg.role === 'agentB' ? 'justify-end' :
                                'justify-center text-xs text-muted-foreground italic py-1' // Adjusted system message style
                            }`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm ${
                                    msg.role === 'agentA' ? 'bg-muted text-foreground' :
                                    msg.role === 'agentB' ? 'bg-primary text-primary-foreground' :
                                    'bg-transparent px-0 py-0 shadow-none' // System message styling
                                }`}
                            >
                                {/* Conditionally render Agent name */}
                                {msg.role === 'agentA' || msg.role === 'agentB' ? (
                                     <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
                                ) : null }
                                {/* Message Content */}
                                {msg.content}
                            </div>
                        </div>
                    ))}
                     {/* Placeholder if conversation is running but no messages yet */}
                     {conversationStatus === "running" && messages.length === 0 && !isStopped && (
                        <div className="text-center text-muted-foreground text-sm p-4">Waiting for first message...</div>
                     )}
                      {/* Message indicating conversation has stopped normally */}
                      {isStopped && conversationStatus === "stopped" && !error && (
                         <div className="text-center text-muted-foreground text-sm p-4">Conversation stopped.</div>
                      )}
                     {/* Invisible div to target for auto-scrolling */}
                     <div ref={messagesEndRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
