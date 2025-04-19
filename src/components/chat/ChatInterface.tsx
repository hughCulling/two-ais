// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase/clientApp';
import {
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    FieldValue,
    serverTimestamp,
    Timestamp,
    updateDoc,
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

// Define the structure of a message document
interface Message {
    id: string;
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    timestamp: Timestamp | null;
}

// Define structure for conversation document data
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


// Define the props for the ChatInterface component
interface ChatInterfaceProps {
    userId: string;
    agentA_llm: string;
    agentB_llm: string;
    apiSecretVersions: { [key: string]: string };
    initialPrompt?: string;
    onConversationStopped?: () => void; // Callback for when user clicks "Go Back" or conversation stops
}

// Basic logger placeholder
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
    const [error, setError] = useState<string | null>(null);
    const [technicalErrorDetails, setTechnicalErrorDetails] = useState<string | null>(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [conversationStatus, setConversationStatus] = useState<ConversationData['status'] | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const setupRan = useRef(false); // Ref to prevent double execution in StrictMode

    // --- DEBUG LOG ---
    useEffect(() => {
        logger.debug(`ChatInterface: conversationId state changed to: ${conversationId}`);
    }, [conversationId]);

    // --- 1. Initiate Conversation ---
    // This effect runs once on mount or when key props change *before* a conversation starts.
    useEffect(() => {
        logger.debug("ChatInterface: Mount/Prop change effect running...");
        // Prevent re-running if setup already ran or if a conversation ID already exists
        if (setupRan.current || conversationId) {
             logger.debug(`ChatInterface: Setup skipped (setupRan: ${setupRan.current}, conversationId: ${conversationId})`);
            return;
        }
        setupRan.current = true; // Mark setup as having run
        logger.debug("ChatInterface: Setup flag set to true.");

        const startConversation = async () => {
             // Basic validation
             if (!userId || !agentA_llm || !agentB_llm || !apiSecretVersions) {
                 logger.error("startConversation called with missing props.");
                 setError("Missing required configuration to start conversation.");
                 setTechnicalErrorDetails(null);
                 setupRan.current = false; // Allow retry if config becomes available
                 return;
             }
             // Reset state for a new conversation attempt
             setError(null);
             setTechnicalErrorDetails(null);
             setIsStopped(false);
             setConversationStatus(null); // Reset status

             logger.info("Attempting to create conversation in Firestore...");
             try {
                 // Create a reference for a new conversation document
                 const newConversationRef = doc(collection(db, "conversations"));
                 const newId = newConversationRef.id;
                 logger.debug(`ChatInterface: Generated new conversation ID: ${newId}`);

                 // Prepare data for the new conversation document
                 type ConversationDataForWrite = Omit<ConversationData, 'createdAt' | 'lastActivity'> & {
                     createdAt: FieldValue;
                     lastActivity: FieldValue;
                 };
                 const conversationData: ConversationDataForWrite = {
                     userId,
                     agentA_llm,
                     agentB_llm,
                     turn: "agentA", // Agent A starts
                     status: "running", // Initial status
                     apiSecretVersions,
                     createdAt: serverTimestamp(), // Use server timestamp
                     lastActivity: serverTimestamp()
                 };

                 // Set the document in Firestore
                 await setDoc(newConversationRef, conversationData);
                 logger.info(`Created conversation document: ${newId} with status 'running'`);

                 // Add the initial system message to trigger the Cloud Function
                 const initialMessageData = {
                     role: "system",
                     content: initialPrompt,
                     timestamp: serverTimestamp()
                 };
                 await addDoc(collection(db, "conversations", newId, "messages"), initialMessageData);
                 logger.info(`Added initial trigger message for conversation: ${newId}`);

                 // Update the component state with the new conversation ID
                 logger.debug(`ChatInterface: Calling setConversationId with: ${newId}`);
                 setConversationId(newId);
                 logger.debug(`ChatInterface: State update setConversationId called.`);

             } catch (err) {
                 logger.error("Error starting conversation:", err);
                  const errorMsg = `Failed to start conversation: ${err instanceof Error ? err.message : String(err)}`;
                  setError(errorMsg);
                  setTechnicalErrorDetails(null); // No specific tech details here
                  setupRan.current = false; // Allow retry on error
             }
         };

         startConversation(); // Execute the async function

         // Cleanup function (optional, runs on unmount or before effect re-runs)
         return () => {
             logger.debug("ChatInterface: Mount/Prop change effect cleanup.");
             // Potentially reset setupRan if component unmounts and might remount later
             // setupRan.current = false; // Consider if needed based on component lifecycle
         };
    // Dependency array: effect re-runs if these props change *before* conversationId is set
    }, [userId, agentA_llm, agentB_llm, apiSecretVersions, initialPrompt, conversationId]);


    // --- 2. Listen for Messages ---
    // This effect runs when conversationId is set.
    useEffect(() => {
        logger.debug(`ChatInterface: Message listener effect running. conversationId: ${conversationId}`);
        if (!conversationId) return; // Don't run if there's no conversation ID

        logger.info(`ChatInterface: Setting up message listener for conversation: ${conversationId}`);
        // Create a query for messages ordered by timestamp
        const messagesQuery = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("timestamp", "asc")
        );

        // Set up the real-time listener
        const unsubscribe = onSnapshot(messagesQuery,
            (querySnapshot) => {
                logger.debug(`ChatInterface: Message snapshot received ${querySnapshot.docs.length} docs.`);
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Basic validation for message data
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
                setMessages(fetchedMessages); // Update state with the new messages
            },
            (err: FirestoreError) => {
                 // Handle errors during listening
                 logger.error(`Error listening to messages for conversation ${conversationId}:`, err);
                 setError(`Failed to load messages: ${err.message}`);
                 setTechnicalErrorDetails(null); // No specific tech details here
            }
        );

        // Cleanup function: unsubscribe when component unmounts or conversationId changes
        return () => {
            logger.info(`ChatInterface: Cleaning up message listener for conversation: ${conversationId}`);
            unsubscribe();
        };
    }, [conversationId]); // Dependency: only depends on conversationId


    // --- 3. Listen for Conversation Status Changes ---
    // This effect runs when conversationId is set.
    useEffect(() => {
        logger.debug(`ChatInterface: Status listener effect running. conversationId: ${conversationId}`);
        if (!conversationId) return; // Don't run if there's no conversation ID

        logger.info(`ChatInterface: Setting up status listener for conversation: ${conversationId}`);
        const conversationDocRef = doc(db, "conversations", conversationId);

        // Set up the real-time listener for the conversation document
        const unsubscribeStatus = onSnapshot(conversationDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as ConversationData;
                    logger.debug(`ChatInterface: Status snapshot received. Status: ${data.status}, ErrorContext: ${data.errorContext}`);
                    setConversationStatus(data.status); // Update status state

                    // Handle specific statuses
                    if (data.status === "error") {
                        // Extract user-friendly and technical error details
                        const fullErrorContext = data.errorContext || "An unknown error occurred in the conversation.";
                        const errorPrefix = "Conversation Error: ";
                        const technicalSeparator = ". Error: ";
                        let userFriendlyError = fullErrorContext;
                        let techDetails: string | null = null;

                        // Remove prefix if present
                        if (fullErrorContext.startsWith(errorPrefix)) {
                            userFriendlyError = fullErrorContext.substring(errorPrefix.length);
                        }
                        // Split into user-friendly and technical parts
                        const techIndex = userFriendlyError.indexOf(technicalSeparator);
                        if (techIndex !== -1) {
                            techDetails = userFriendlyError.substring(techIndex + technicalSeparator.length);
                            userFriendlyError = userFriendlyError.substring(0, techIndex + 1); // Keep the period
                        } else {
                             techDetails = null; // No technical details found
                        }

                        setError(errorPrefix + userFriendlyError); // Set combined user error
                        setTechnicalErrorDetails(techDetails); // Set technical details (or null)
                        setShowErrorDetails(false); // Hide details initially
                        setIsStopped(true); // An error state implies the conversation is stopped
                        logger.warn(`Conversation ${conversationId} entered error state: ${userFriendlyError}`);
                    } else if (data.status === "stopped") {
                        setIsStopped(true); // Mark as stopped
                        // Clear any previous conversation errors if stopped normally
                        if (error && error.startsWith("Conversation Error:")) {
                             setError(null);
                             setTechnicalErrorDetails(null);
                        }
                        logger.info(`Conversation ${conversationId} status changed to 'stopped'.`);
                    } else if (data.status === "running") {
                         // Clear any previous conversation errors if it recovers
                         if (error && error.startsWith("Conversation Error:")) {
                             setError(null);
                             setTechnicalErrorDetails(null);
                         }
                         setIsStopped(false); // Mark as not stopped
                    }
                } else {
                    // Handle case where the conversation document is unexpectedly missing
                    logger.warn(`Conversation document ${conversationId} does not exist in status listener.`);
                    setError("Conversation data not found.");
                    setTechnicalErrorDetails(null);
                    setIsStopped(true); // Treat as stopped if data is gone
                }
            },
            (err: FirestoreError) => {
                // Handle errors during listening
                logger.error(`Error listening to conversation status for ${conversationId}:`, err);
                setError(`Failed to get conversation status: ${err.message}`);
                setTechnicalErrorDetails(null);
                setIsStopped(true); // Treat as stopped on listener error
            }
        );

        // Cleanup function: unsubscribe when component unmounts or conversationId changes
        return () => {
            logger.info(`ChatInterface: Cleaning up status listener for conversation: ${conversationId}`);
            unsubscribeStatus();
        };
    }, [conversationId, error]); // Dependency: conversationId and error (to clear error state if status changes)


    // --- 4. Auto-scroll ---
    // This effect runs when messages, status, or stopped state change.
    useEffect(() => {
        // Only scroll if the conversation is running and not explicitly stopped
        if (conversationStatus === "running" && !isStopped) {
            // Use 'nearest' to avoid scrolling if already visible
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            if (messagesEndRef.current) {
                logger.debug("Attempted smooth scroll to messagesEndRef.");
            } else {
                logger.debug("messagesEndRef not available for scrolling yet.");
            }
        } else {
             logger.debug(`Skipping scroll. Status: ${conversationStatus}, isStopped: ${isStopped}`);
        }
    // Dependency array: triggers scroll on new messages or status changes affecting scroll logic
    }, [messages, conversationStatus, isStopped]);


    // --- 5. Stop Conversation Handler ---
    // useCallback memoizes the function so it doesn't get recreated on every render
    const handleStopConversation = useCallback(async () => {
        // Prevent action if no ID, already stopping, or already stopped
        if (!conversationId || isStopping || isStopped) return;

        setIsStopping(true); // Indicate stopping process has started
        logger.info(`Attempting to stop conversation: ${conversationId}`);
        try {
            const conversationRef = doc(db, "conversations", conversationId);
            // Update Firestore document status to 'stopped'
            await updateDoc(conversationRef, {
                status: "stopped",
                lastActivity: serverTimestamp() // Update last activity timestamp
            });
            logger.info(`Conversation ${conversationId} status set to stopped via button.`);
            // Call the callback prop if provided
            if (onConversationStopped) {
                onConversationStopped();
            }
            // Note: The status listener will eventually update isStopped state to true
        } catch (err) {
            logger.error(`Error stopping conversation ${conversationId}:`, err);
            // Display an error specific to the stop action
            setError(`Failed to stop conversation: ${err instanceof Error ? err.message : String(err)}`);
            setTechnicalErrorDetails(null);
        } finally {
            setIsStopping(false); // Reset stopping indicator regardless of success/failure
        }
    }, [conversationId, isStopping, isStopped, onConversationStopped]); // Dependencies for useCallback


    // --- 6. Render Logic ---
    logger.debug(`ChatInterface: Rendering. Status: ${conversationStatus}, isStopped: ${isStopped}, Error: ${error}, Messages: ${messages.length}`);

    // --- A. Error Display ---
    // Render this block if any error state is set
    if (error) {
        logger.debug("Rendering Error Alert. Technical Details State:", technicalErrorDetails);
        return (
             <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              {/* Display the primary error message */}
              <AlertDescription className="text-sm break-words whitespace-pre-wrap">
                {error}
              </AlertDescription>

              {/* Wrapper div to force column layout and manage spacing */}
              {/* This div sits below AlertDescription and contains the conditional button sections */}
              <div className="mt-4 flex flex-col items-start space-y-3">

                  {/* Section for "Show Details" button and technical details */}
                  {/* Render this only if technical details exist */}
                  {technicalErrorDetails && (
                      // Removed w-full from this div (back to v3 structure)
                      <div>
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowErrorDetails(!showErrorDetails)}
                              className="text-xs h-6 px-2" // Small button style
                          >
                              {showErrorDetails ? 'Hide Details' : 'Show Details'}
                              {showErrorDetails ? <ChevronUp className="ml-1 h-3 w-3"/> : <ChevronDown className="ml-1 h-3 w-3"/>}
                          </Button>
                          {/* Conditionally display the technical details in a preformatted block */}
                          {showErrorDetails && (
                              // --- START FIX ---
                              // Added min-w-0: Helps the element shrink correctly within flex/grid contexts
                              // Kept w-full: Makes it try to fill the container width
                              // Kept wrapping/overflow/styling classes
                              <pre className="mt-1 text-xs whitespace-pre-wrap break-words overflow-auto max-h-32 rounded-md border bg-muted p-2 font-mono w-full min-w-0">
                                  {technicalErrorDetails}
                              </pre>
                              // --- END FIX ---
                          )}
                      </div>
                  )}

                  {/* Section for "Go Back" button */}
                  {/* Render this button only if the conversation is stopped and the callback exists */}
                  {isStopped && onConversationStopped && (
                       // This div is now a flex item within the column wrapper
                       <div>
                           <Button
                               variant="outline"
                               className="px-4" // Default size with some horizontal padding
                               onClick={onConversationStopped} // Use the provided callback
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
    // Show this while waiting for the conversation to be created and status listener to run
    if (!conversationId || (!conversationStatus && !error)) {
        return <div className="p-4 text-center text-muted-foreground">Initializing conversation...</div>;
    }

    // --- C. Main Chat Interface Render ---
    // Render the chat view if no error and conversation is initialized
    return (
        <div className="flex flex-col h-[70vh] w-full p-4 bg-background rounded-lg shadow-md border overflow-hidden">
            {/* Header Section */}
            <div className="flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b">
                <h2 className="text-lg font-semibold">AI Conversation</h2>
                {/* Stop Button */}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopConversation}
                    disabled={isStopping || isStopped} // Disable if stopping or already stopped
                >
                    {isStopped ? "Stopped" : (isStopping ? "Stopping..." : "Stop Conversation")}
                </Button>
            </div>

             {/* Scrollable Message Area */}
             {/* Use ScrollArea component for consistent scrollbar styling */}
             <ScrollArea className="flex-grow min-h-0 mb-4 pr-4"> {/* min-h-0 prevents flexbox overflow */}
                <div className="space-y-4"> {/* Adds vertical space between messages */}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            // Align messages based on role
                            className={`flex ${
                                msg.role === 'agentA' ? 'justify-start' :
                                msg.role === 'agentB' ? 'justify-end' :
                                'justify-center text-xs text-muted-foreground italic' // System messages
                            }`}
                        >
                            <div
                                // Style message bubbles based on role
                                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm ${
                                    msg.role === 'agentA' ? 'bg-muted text-foreground' : // Agent A style
                                    msg.role === 'agentB' ? 'bg-primary text-primary-foreground' : // Agent B style
                                    'bg-transparent px-0 py-1' // System message style (minimal)
                                }`}
                            >
                                {/* Add Agent labels for clarity */}
                                {msg.role === 'agentA' || msg.role === 'agentB' ? (
                                     <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
                                ) : null }
                                {/* Display message content */}
                                {msg.content}
                            </div>
                        </div>
                    ))}
                     {/* Placeholder if conversation is running but no messages yet */}
                     {conversationStatus === "running" && messages.length === 0 && (
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

            {/* Footer can be added here if needed (e.g., input box for user interaction) */}
            {/* <div className="flex-shrink-0 mt-auto pt-2 border-t"> ... </div> */}
        </div>
    );
}
