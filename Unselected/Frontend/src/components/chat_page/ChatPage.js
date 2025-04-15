// src/components/chat_page/ChatPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Topbar from '../shared/TopBar';
import ChatConversation from './ChatConversation';
import ChatInput from './ChatInput';
import api from '../../api';
import '../../styles/ChatPage.css';

const POLLING_INTERVAL = 5000;

const ChatPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { getAccessTokenSilently, user: auth0User } = useAuth0();

    // --- State ---
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true); // Renamed for clarity
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [loggedInUserData, setLoggedInUserData] = useState(null);
    const lastMessageIdRef = useRef(0);
    const pollingIntervalRef = useRef(null);

    // --- Session Info ---
    const sessionFromState = state?.session;
    const sessionId = sessionFromState?.sessionId;

    // Function to get authenticated config (memoized)
    const getAuthConfig = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently();
            return {
                headers: { Authorization: `Bearer ${token}` }
            };
        } catch (err) {
            console.error("ChatPage: Error getting access token:", err);
            setError("Authentication error. Please refresh or log in again.");
            // Ensure loading states are false if auth fails critically
            setIsUserLoading(false);
            setIsLoadingMessages(false);
            throw err; // Re-throw to stop further execution in calling functions
        }
    }, [getAccessTokenSilently]);

    // --- Effect to Fetch Logged-in User Data ON MOUNT ---
    useEffect(() => {
        const fetchCurrentUser = async () => {
            console.log("ChatPage: Mount effect - Checking session...");
             // Redirect immediately if session is missing
            if (!sessionFromState || !sessionId) {
                console.log("ChatPage: No session state found on mount, redirecting to dashboard.");
                navigate('/dashboard');
                setIsUserLoading(false); // Stop loading if redirecting
                return; // Stop this effect
            }

            console.log("ChatPage: Session valid, attempting to fetch logged-in user account details...");
            setIsUserLoading(true);
            setLoggedInUserData(null); // Reset user data on fetch attempt
            setError(null); // Clear previous errors

            try {
                const config = await getAuthConfig(); // Get token first
                console.log("ChatPage: Auth config obtained. Fetching /Account...");

                // Assume GET /Account returns the current user based on the token
                const response = await api.get('/Account', config);
                console.log("ChatPage: /Account API Response Status:", response.status);
                console.log("ChatPage: /Account API Response Data:", response.data); // Log the raw data

                // *** CRITICAL CHECK: Ensure data and userId exist ***
                if (response.data && response.data.userId) {
                    console.log("ChatPage: User ID found in response data:", response.data.userId);
                    setLoggedInUserData(response.data); // <<< Store user data in state
                } else {
                    console.error("ChatPage: Received data from /Account, but 'userId' property is missing or invalid.", response.data);
                    // Keep loggedInUserData as null
                    throw new Error("User ID not found in account data."); // Throw error to be caught below
                }
            } catch (err) {
                console.error("ChatPage: Error during fetchCurrentUser:", err.response || err);
                 let specificError = "Could not load your user details. Chat may not function correctly.";
                 if (err.message === "User ID not found in account data.") {
                    specificError = "Received invalid user data structure from server.";
                 } else if (err.response?.status === 401) {
                     specificError = "Authorization error fetching user details. Please log in again.";
                 } else if (err.response?.status === 404) {
                     specificError = "User account not found on the server.";
                 }
                 setError(specificError);
                 setLoggedInUserData(null); // Ensure user data is null on error
            } finally {
                console.log("ChatPage: fetchCurrentUser finished.");
                setIsUserLoading(false); // Finish loading user data (success or fail)
            }
        };

        fetchCurrentUser(); // Call the fetch function

        // Cleanup function for the effect (optional, but good practice for async)
        return () => {
            console.log("ChatPage: User fetch effect cleanup.");
            // Potential cleanup if needed, e.g., aborting fetch requests
        }

    }, [getAuthConfig, navigate, sessionFromState, sessionId]); // Dependencies


    // --- Fetching Messages (dependent on loggedInUserData) ---
    const fetchMessages = useCallback(async (isInitialFetch = false) => {
        // *** GUARD: Wait until we have the logged-in user's ID AND a valid session ***
        if (!sessionId || !loggedInUserData?.userId) {
            console.log(`ChatPage: Skipping message fetch - missing session (${!!sessionId}) or user ID (${!!loggedInUserData?.userId}).`);
            if (isInitialFetch) setIsLoadingMessages(false); // Ensure loading finishes if we can't fetch
            return;
        }

        console.log(`ChatPage: Conditions met for fetching messages (User ID: ${loggedInUserData.userId}, Session: ${sessionId}, Initial: ${isInitialFetch})`);

        if (isInitialFetch) {
            setIsLoadingMessages(true);
            // Clear previous message-related errors on initial fetch
            // setError(null); // Be cautious not to clear critical user errors
        }

        try {
            const config = await getAuthConfig();
            const lastId = isInitialFetch ? 0 : lastMessageIdRef.current;
            const url = `/Messages/${lastId}/session/${sessionId}`;

            console.log(`ChatPage: Fetching messages from ${url}`);
            const response = await api.get(url, config);
            const newMessages = response.data || [];

            if (newMessages.length > 0) {
                const maxId = newMessages.reduce((max, msg) => Math.max(max, msg.messageId || 0), lastMessageIdRef.current);
                lastMessageIdRef.current = maxId;
                console.log(`ChatPage: Fetched ${newMessages.length} new messages. New lastMessageId: ${maxId}`);

                const findSenderName = (senderUserId) => {
                    // Prioritize loggedInUserData if it matches
                    if (senderUserId === loggedInUserData.userId) {
                        return loggedInUserData.displayName || loggedInUserData.userName || `User ${senderUserId}`;
                    }
                    // Look in session participants otherwise
                    const sender = sessionFromState?.users?.find(u => u.userId === senderUserId);
                    return sender?.displayName || sender?.userName || `User ${senderUserId}`; // Fallback
                };

                const messagesWithSenderInfo = newMessages.map(msg => ({
                    ...msg,
                    senderName: findSenderName(msg.userId) // Use the helper
                }));

                // Log the first message with sender info for verification
                if (messagesWithSenderInfo.length > 0) {
                     console.log("ChatPage: Example message object with senderName:", messagesWithSenderInfo[0]);
                }


                if (isInitialFetch) {
                    setMessages(messagesWithSenderInfo);
                } else {
                    setMessages(prevMessages => [...prevMessages, ...messagesWithSenderInfo]);
                }
                // Clear non-critical errors if messages are successfully fetched
                 if (error && error.startsWith("Error fetching messages")) {
                     setError(null);
                 }

            } else {
                 console.log(`ChatPage: No new messages found.`);
                 // Clear transient message fetch errors if no new messages arrive
                 if (error && error.startsWith("Error fetching messages")) {
                     setError(null);
                 }
            }

        } catch (err) {
            console.error("ChatPage: Error fetching messages:", err.response || err);
            let specificError = "Error fetching messages.";
             if (err.response?.status === 401) {
                 specificError = "Authorization failed fetching messages. Please refresh or log in again.";
             } else if (err.response?.status === 404) {
                 specificError = "Message history not found for this session.";
             }
            // Set error, but be careful not to overwrite a critical user-loading error
             if (!error || err.response?.status === 401) {
                 setError(specificError);
             }
        } finally {
            if (isInitialFetch) setIsLoadingMessages(false); // Finish message loading state
        }
    }, [sessionId, getAuthConfig, loggedInUserData, sessionFromState?.users, error]); // Added error dependency


    // --- Effect for Initial Message Fetch and Polling Setup ---
    useEffect(() => {
        // *** GUARD: Wait until user data is loaded successfully before starting polling ***
        if (isUserLoading || !loggedInUserData?.userId || !sessionId) {
            console.log(`ChatPage: Polling setup waiting - isUserLoading: ${isUserLoading}, hasUserData: ${!!loggedInUserData?.userId}, hasSessionId: ${!!sessionId}`);
            // Clear any existing interval if conditions become invalid
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
                console.log("ChatPage: Cleared existing polling interval.");
            }
            return; // Don't proceed
        }

        console.log(`ChatPage: User data loaded (ID: ${loggedInUserData.userId}). Initializing message fetch & polling for session: ${sessionId}`);
        fetchMessages(true); // Perform initial fetch now that we have user ID

        // Clear previous interval just in case
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Set up polling
        console.log("ChatPage: Setting up polling interval.");
        pollingIntervalRef.current = setInterval(() => {
            console.log("ChatPage: Polling for new messages...");
            fetchMessages(false);
        }, POLLING_INTERVAL);

        // Cleanup function
        return () => {
            console.log("ChatPage: Cleaning up polling interval for session:", sessionId);
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
        // Rerun if session/user changes, or fetchMessages logic changes
    }, [sessionId, fetchMessages, loggedInUserData, isUserLoading]); // Depends on user loading state and data


    // --- Sending Messages (dependent on loggedInUserData) ---
    const handleSendMessage = async (newMsgContent) => {
         const trimmedMessage = newMsgContent.trim();
         // *** GUARD: Ensure we have user data AND session before sending ***
         if (!trimmedMessage || !sessionId || !loggedInUserData?.userId) {
             console.warn("ChatPage: Cannot send message, missing session or user data.");
             setError("Cannot send message. User data not loaded correctly.");
             return;
         }
         // Clear previous non-critical errors before sending
         if (error && !error.toLowerCase().includes("user")) {
             setError(null);
         }


         const optimisticMessage = {
             messageId: `optimistic-${Date.now()}`,
             userId: loggedInUserData.userId,
             content: trimmedMessage,
             createdOn: new Date().toISOString(),
             isRead: false,
             // Ensure senderName uses the correct fields from loggedInUserData
             senderName: loggedInUserData.displayName || loggedInUserData.userName || `User ${loggedInUserData.userId}`
         };

         console.log("ChatPage: Adding optimistic message:", optimisticMessage);
         setMessages(prevMessages => [...prevMessages, optimisticMessage]);

         try {
             const config = await getAuthConfig();
             const payload = { sessionId: sessionId, content: trimmedMessage };
             config.headers['Content-Type'] = 'application/json';

             console.log("ChatPage: Sending message payload:", payload);
             const response = await api.post('/Messages', payload, config);

             if (response.status === 201 && response.data?.messageId) { // Check for messageId in response
                  const newMessageFromServer = {
                      ...response.data,
                      // Add senderName again based on loggedInUserData
                      senderName: loggedInUserData.displayName || loggedInUserData.userName || `User ${loggedInUserData.userId}`
                  };
                 console.log("ChatPage: Message sent successfully, server response:", newMessageFromServer);
                 setMessages(prevMessages => prevMessages.map(msg =>
                     msg.messageId === optimisticMessage.messageId
                         ? newMessageFromServer // Replace with full server message + senderName
                         : msg
                 ));
                 lastMessageIdRef.current = Math.max(lastMessageIdRef.current, newMessageFromServer.messageId || 0);
             } else {
                 console.error("ChatPage: Failed to send message or invalid response data.", response);
                 throw new Error(`Failed to send message. Status: ${response.status}`);
             }
         } catch (err) {
             console.error("ChatPage: Error sending message:", err.response || err);
             let specificError = "Error sending message.";
             if (err.response?.status === 401) specificError = "Authorization failed sending message.";
             else if (err.response?.status === 400) specificError = "Invalid message data.";
             setError(specificError);
             // Remove the optimistic message on failure
             setMessages(prevMessages => prevMessages.filter(msg => msg.messageId !== optimisticMessage.messageId));
         }
    };


    // --- Render Logic ---

    // 1. Still loading the essential user data?
    if (isUserLoading) {
        console.log("ChatPage: Rendering - State: Loading User Details");
        return (
            <div className="chat-page">
                <Topbar />
                <div className="loading-msg-chat">Loading user details...</div>
            </div>
        );
    }

    // 2. Failed to load essential user data? (Check loggedInUserData directly)
    //    This is the CRITICAL gate before rendering the chat interface.
    if (!loggedInUserData) {
        console.log("ChatPage: Rendering - State: Failed to load User Data");
        return (
            <div className="chat-page">
                <Topbar />
                <div className="error-msg chat-error">
                   {error || "Failed to load user information. Cannot display chat."}
                </div>
            </div>
        );
    }

    // --- At this point, we know: ---
    // - isUserLoading is false
    // - loggedInUserData is definitely set (contains at least userId)

    // 3. Show loading state for initial messages (if needed)
    if (isLoadingMessages && messages.length === 0) {
        console.log("ChatPage: Rendering - State: Loading Initial Messages");
        return (
            <div className="chat-page">
                <Topbar />
                {/* Render conversation area with a loading overlay/message */}
                <main className="conversation-area">
                     {/* You could render shell/placeholder bubbles here */}
                     <div className="loading-msg-chat overlaid">Loading messages...</div>
                </main>
                <ChatInput
                     onSend={handleSendMessage}
                     disabled={true} // Disable while loading messages
                />
            </div>
        );
    }

    // 4. Main render - Ready to chat (or show non-critical errors)
    console.log(`ChatPage: Rendering - State: Chat Ready (User ID: ${loggedInUserData.userId}, Messages: ${messages.length})`);
    return (
        <div className="chat-page">
            <Topbar />
            {/* Display non-critical errors (e.g., message fetch/send errors AFTER initial load) */}
            {error && !error.toLowerCase().includes("user") && <div className="error-msg chat-error">{error}</div>}

            <ChatConversation
                messages={messages}
                currentUserId={loggedInUserData.userId} // Pass the ID - we know it exists now
            />
            <ChatInput
                onSend={handleSendMessage}
                // Disable input if message loading is still happening (e.g., polling slow)
                // or if there was a critical user error somehow missed (belt-and-suspenders)
                disabled={isLoadingMessages || !loggedInUserData?.userId}
            />
        </div>
    );
};

export default ChatPage;