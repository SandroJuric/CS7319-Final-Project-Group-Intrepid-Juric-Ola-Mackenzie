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
    const [isLoading, setIsLoading] = useState(true); // For initial message load
    const [isUserLoading, setIsUserLoading] = useState(true); // Separate loading state for user data
    const [loggedInUserData, setLoggedInUserData] = useState(null); // <<< State to store logged-in user data
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
            console.error("Error getting access token:", err);
            setError("Authentication error. Please refresh or log in again.");
            throw err;
        }
    }, [getAccessTokenSilently]);

    // --- Effect to Fetch Logged-in User Data ON MOUNT ---
    useEffect(() => {
        const fetchCurrentUser = async () => {
            console.log("ChatPage: Attempting to fetch logged-in user account details...");
            setIsUserLoading(true); // Start loading user data
            setError(null); // Clear previous errors specific to user fetching
            try {
                const config = await getAuthConfig();
                // Assume GET /Account returns the current user based on the token
                const response = await api.get('/Account', config);

                if (response.data && response.data.userId) { // Check if data and userId exist
                    console.log("ChatPage: Logged-in user data received:", response.data);
                    setLoggedInUserData(response.data); // <<< Store user data in state
                } else {
                     // Handle cases where the API might return 200 OK but empty/invalid data
                     console.error("ChatPage: Received empty or invalid user data from /Account", response.data);
                     throw new Error("No valid user data received from /Account.");
                }
            } catch (err) {
                console.error("Error fetching current user data:", err.response || err);
                 let specificError = "Could not load your user details. Chat may not function correctly.";
                 if (err.response?.status === 401) {
                     specificError = "Authorization error fetching user details. Please log in again.";
                 } else if (err.response?.status === 404) {
                      specificError = "User account not found on the server.";
                 }
                setError(specificError);
                setLoggedInUserData(null); // Ensure user data is null on error
                // Potentially navigate away or disable chat input if user data is critical
            } finally {
                setIsUserLoading(false); // Finish loading user data (success or fail)
            }
        };

        // Redirect immediately if session is missing, before trying to fetch user
        if (!sessionFromState || !sessionId) {
             console.log("ChatPage: No session state found on mount, redirecting to dashboard.");
             navigate('/dashboard');
             return; // Stop this effect
        }

        fetchCurrentUser(); // Call the fetch function

    }, [getAuthConfig, navigate, sessionFromState, sessionId]); // Dependencies: run when auth config or session potentially changes


    // --- Fetching Messages (dependent on loggedInUserData) ---
    const fetchMessages = useCallback(async (isInitialFetch = false) => {
        // *** GUARD: Wait until we have the logged-in user's ID ***
        if (!sessionId || !loggedInUserData?.userId) {
            console.log("ChatPage: Skipping message fetch - missing session or user ID.");
            if (isInitialFetch) setIsLoading(false); // Ensure loading finishes if we can't fetch
            return;
        }

        if (isInitialFetch) {
            setIsLoading(true); // Loading state for messages
            // Don't clear general error here, might be a user loading error
        }

        try {
            const config = await getAuthConfig();
            const lastId = isInitialFetch ? 0 : lastMessageIdRef.current;
            const url = `/Messages/${lastId}/session/${sessionId}`;

            console.log(`ChatPage: Fetching messages from ${url} (User ID: ${loggedInUserData.userId})`);
            const response = await api.get(url, config);
            const newMessages = response.data || [];

            if (newMessages.length > 0) {
                const maxId = newMessages.reduce((max, msg) => Math.max(max, msg.messageId || 0), lastMessageIdRef.current);
                lastMessageIdRef.current = maxId;
                console.log(`ChatPage: Fetched ${newMessages.length} new messages. New lastMessageId: ${maxId}`);

                // Add senderName info if needed for display (assuming API only gives userId)
                const findSenderName = (senderUserId) => {
                    const sender = sessionFromState?.users?.find(u => u.userId === senderUserId);
                    return sender?.displayName || sender?.userName || `User ${senderUserId}`;
                };

                const messagesWithSenderInfo = newMessages.map(msg => ({
                    ...msg,
                    senderName: msg.userId === loggedInUserData.userId
                        ? (loggedInUserData.displayName || loggedInUserData.userName) // Use current user's name
                        : findSenderName(msg.userId) // Find name for others
                }));

                if (isInitialFetch) {
                    setMessages(messagesWithSenderInfo);
                } else {
                    setMessages(prevMessages => [...prevMessages, ...messagesWithSenderInfo]);
                }
                 // Clear message-specific errors on success
                 // Avoid clearing user-loading errors here
                 // setError(null);
            } else {
                 console.log(`ChatPage: No new messages found.`);
            }

        } catch (err) {
             // Handle message fetching errors (distinct from user fetching errors)
            console.error("Error fetching messages:", err.response || err);
             let specificError = "Error fetching messages.";
             if (err.response?.status === 401) {
                specificError = "Authorization failed fetching messages. Please refresh or log in again.";
             } else if (err.response?.status === 404) {
                specificError = "Message history not found for this session.";
             }
             // Set error, but be careful not to overwrite a critical user-loading error
             if (!error || err.response?.status === 401) { // Prioritize auth errors or set if no error exists
                setError(specificError);
             }
        } finally {
            if (isInitialFetch) setIsLoading(false); // Finish message loading state
        }
    }, [sessionId, getAuthConfig, loggedInUserData, sessionFromState?.users]); // Depends on user data now


    // --- Effect for Initial Message Fetch and Polling Setup ---
    useEffect(() => {
        // *** GUARD: Wait until user data is loaded and valid before starting polling ***
        if (isUserLoading || !loggedInUserData?.userId || !sessionId) {
             console.log("ChatPage: Waiting for user data or session before starting message polling...");
             // Clear any existing interval if user becomes invalid
             if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
             }
             return;
        }

        console.log(`ChatPage: User data loaded (ID: ${loggedInUserData.userId}). Initializing message fetch & polling for session: ${sessionId}`);
        fetchMessages(true); // Perform initial fetch now that we have user ID

        // Clear previous interval just in case
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Set up polling
        pollingIntervalRef.current = setInterval(() => {
            fetchMessages(false);
        }, POLLING_INTERVAL);

        // Cleanup function
        return () => {
            console.log("ChatPage: Cleaning up interval for session:", sessionId);
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
        // Rerun if session/user changes
    }, [sessionId, fetchMessages, loggedInUserData, isUserLoading]); // Depends on user loading state and data


    // --- Sending Messages (dependent on loggedInUserData) ---
    const handleSendMessage = async (newMsgContent) => {
        const trimmedMessage = newMsgContent.trim();
        // *** GUARD: Ensure we have user data before sending ***
        if (!trimmedMessage || !sessionId || !loggedInUserData?.userId) {
            console.warn("ChatPage: Cannot send message, missing session or user data.");
            setError("Cannot send message. User data not loaded correctly.");
            return;
        }
        setError(null); // Clear previous send errors

        const optimisticMessage = {
            messageId: `optimistic-${Date.now()}`, // Temporary ID for React key
            userId: loggedInUserData.userId,        // Use logged-in user's ID
            content: trimmedMessage,
            createdOn: new Date().toISOString(),
            isRead: false,
            senderName: loggedInUserData.displayName || loggedInUserData.userName // Use logged-in user's name
        };

        setMessages(prevMessages => [...prevMessages, optimisticMessage]);

        try {
            const config = await getAuthConfig();
            const payload = { sessionId: sessionId, content: trimmedMessage };
            config.headers['Content-Type'] = 'application/json';

            console.log("ChatPage: Sending message payload:", payload);
            const response = await api.post('/Messages', payload, config);

            if (response.status === 201 && response.data) {
                 const newMessageFromServer = response.data;
                 console.log("ChatPage: Message sent successfully, server response:", newMessageFromServer);
                 // Replace optimistic message with server version
                 setMessages(prevMessages => prevMessages.map(msg =>
                     msg.messageId === optimisticMessage.messageId
                         ? { ...newMessageFromServer, senderName: loggedInUserData.displayName || loggedInUserData.userName }
                         : msg
                 ));
                 lastMessageIdRef.current = Math.max(lastMessageIdRef.current, newMessageFromServer.messageId || 0);
            } else {
                 throw new Error(`Failed to send message. Status: ${response.status}`);
            }
        } catch (err) {
             console.error("Error sending message:", err.response || err);
             let specificError = "Error sending message.";
             if (err.response?.status === 401) specificError = "Authorization failed sending message.";
             else if (err.response?.status === 400) specificError = "Invalid message data.";
             setError(specificError);
             // Remove the optimistic message on failure
             setMessages(prevMessages => prevMessages.filter(msg => msg.messageId !== optimisticMessage.messageId));
        }
    };

    // --- Render Logic ---

    // Show loading state while fetching user data
    if (isUserLoading) {
        return (
             <div className="chat-page">
                  <Topbar />
                  <div className="loading-msg-chat">Loading user details...</div>
             </div>
        );
    }

     // Show error if user data failed to load and we cannot proceed
     if (!loggedInUserData && error) {
          return (
               <div className="chat-page">
                    <Topbar />
                    <div className="error-msg chat-error">{error}</div>
                    {/* Optionally add a retry button or link to login */}
               </div>
          );
     }

     // Show loading state for initial messages (after user is loaded)
     if (isLoading && messages.length === 0 && !error) {
        return (
            <div className="chat-page">
                <Topbar />
                <div className="loading-msg-chat">Loading messages...</div>
            </div>
        );
    }

    // Main render - ready to chat (or show errors that occurred after user load)
    return (
        <div className="chat-page">
            <Topbar />
            {/* Display general errors (like message fetch/send errors) */}
            {error && <div className="error-msg chat-error">{error}</div>}

            <ChatConversation
                messages={messages}
                loggedInUserId={loggedInUserData?.userId} // Pass the ID
            />
             {/* Disable input if loggedInUserData is somehow still null (shouldn't happen if guards work) */}
            <ChatInput
                onSend={handleSendMessage}
                disabled={!loggedInUserData?.userId}
            />
        </div>
    );
};

export default ChatPage;