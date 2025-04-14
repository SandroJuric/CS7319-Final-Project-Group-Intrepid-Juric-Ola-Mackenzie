import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Your configured Axios instance
import Topbar from '../shared/TopBar';
import Sidebar from '../shared/SideBar';
import ActiveChats from './ActiveChats';
import NewChatModal from './NewChatModal';
import { BsPlusCircleFill } from 'react-icons/bs';
import '../../styles/Dashboard.css';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    // Fetch initial data - Authentication logic already correct here
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const token = await getAccessTokenSilently();
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                console.log("Dashboard: Fetching initial data with token.");

                //ensure that the user is login in
                api.post('/Users/Login');

                const [userResponse, sessionsResponse, allUsersResponse] = await Promise.all([
                    api.get('/Account', config),
                    api.get('/Sessions', config),
                    api.get('/Users', config)
                ]);
                setCurrentUser(userResponse.data);
                setSessions(sessionsResponse.data || []);
                setAllUsers(allUsersResponse.data || []);
                console.log("Dashboard: Initial data fetched successfully.");
            } catch (err) {
                console.error("Error fetching dashboard data:", err.response || err);
                let specificError = "Unable to load dashboard data.";
                if (err.response && err.response.status === 401) {
                   specificError = "Authorization failed. Please log in again or refresh.";
                } else if (err.config?.url?.includes('/Account')) {
                   specificError = "Unable to load user profile.";
                } else if (err.config?.url?.includes('/Sessions')) {
                   specificError = "Unable to load active chats.";
                } else if (err.config?.url?.includes('/Users')) {
                   specificError = "Unable to load user list.";
                }
                setError(specificError);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [getAccessTokenSilently]);

    // Archive a session - Explicit auth added
    const handleArchive = async (sessionId) => {
        setError(null);
        try {
            const token = await getAccessTokenSilently();
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            console.log(`Dashboard: Archiving session ${sessionId} with token.`);
            await api.delete(`/Sessions/${sessionId}`, config);
            setSessions(prevSessions => prevSessions.filter(session => session.sessionId !== sessionId));
            console.log(`Dashboard: Session ${sessionId} archived successfully.`);
        } catch (err) {
            console.error("Error archiving session:", err.response || err);
            let specificError = "Error archiving chat.";
            if (err.response && err.response.status === 401) {
               specificError = "Authorization failed. Please log in again or refresh.";
            }
            setError(specificError);
        }
    };

    // --- Modal Functions ---
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Start new chat - CORRECTED API CALL based on Swagger
    const handleStartNewChat = async (selectedUser) => {
        if (!selectedUser || typeof selectedUser.userId === 'undefined') {
             console.error("Dashboard: Invalid selectedUser object", selectedUser);
             setError("Cannot start chat: Invalid user data.");
             return;
        }; // Add check for userId existence

        setError(null);
        // Log the ID we are about to use
        console.log(`Dashboard: Attempting to start chat with userId: ${selectedUser.userId}`);
        try {
            const token = await getAccessTokenSilently();
            const config = {
                headers: { Authorization: `Bearer ${token}` }
                // We don't need Content-Type if the body is null/empty
            };

            // --- Start CORRECTED Logic ---
            // Construct URL with userId as a query parameter
            const url = `/Sessions?userId=${selectedUser.userId}`;
            // Send POST request with the URL, null as the body, and the config for headers
            console.log(`Dashboard: POSTing to ${url} with token.`);
            const response = await api.post(url, null, config);
            // --- End CORRECTED Logic ---

            if (response.status === 201 && response.data) {
                const newSession = response.data;
                console.log("Dashboard: New session created:", newSession);
                closeModal();
                navigate('/chat', { state: { session: newSession } });
            } else {
                // This case might indicate an issue even if status code wasn't an error
                console.warn("Dashboard: Session creation response status not 201 or missing data", response);
                throw new Error(`Failed to create session. Status: ${response.status}`);
            }
        } catch (err) {
            console.error("Error starting new chat:", err.response || err);
            let specificError = `Could not start chat with ${selectedUser.email || `userId ${selectedUser.userId}`}.`;
             if (err.response && err.response.status === 401) {
                 specificError = "Authorization failed. Please log in again or refresh.";
             } else if (err.response && err.response.status === 500) {
                 specificError = "Server error occurred while creating chat. Please contact support.";
             } else if (err.response && err.response.data && err.response.data.detail) {
                 specificError = err.response.data.detail; // Use specific backend error if available
             } else if (err.message === 'Network Error') {
                // THIS IS LIKELY STILL THE CORS ERROR
                 specificError = "Network error or CORS issue. Please check backend CORS configuration.";
             }
            setError(specificError);
            closeModal(); // Close modal even if error occurs
        }
    };


    // Calculate available users (no changes needed here)
    const availableUsersToChat = useMemo(() => {
        if (!currentUser || !allUsers || !sessions) return [];
        const activeSessionUserIds = new Set(
            sessions.flatMap(session => session.users?.map(user => user.userId) || [])
        );
        return allUsers.filter(user =>
            user.userId !== currentUser.userId &&
            !activeSessionUserIds.has(user.userId)
        );
    }, [allUsers, sessions, currentUser]);

    // Change status - Explicit auth added
    const handleStatusChange = async () => {
        setError(null);
        try {
            const token = await getAccessTokenSilently();
            const config = {
                 headers: { Authorization: `Bearer ${token}` }
            };
             console.log("Dashboard: Patching /Account/Status with token.");
             await api.patch('/Account/Status', null, config);
             console.log("Dashboard: Status change requested.");
             // Consider refetching user data if status change should reflect immediately
             // const userResponse = await api.get('/Account', config);
             // setCurrentUser(userResponse.data);
        } catch (err) {
            console.error("Error changing status:", err.response || err);
            let specificError = "Error changing status.";
            if (err.response && err.response.status === 401) {
                 specificError = "Authorization failed. Please log in again or refresh.";
            }
            setError(specificError);
        }
    };

    // Navigate to profile (no changes needed)
    const handleManageAccount = () => {
        navigate('/profile');
    };

    return (
        <div className="dashboard-container">
            <Topbar />
            <div className="dashboard-content">
                <Sidebar
                    onStatusChange={handleStatusChange}
                    onManageAccount={handleManageAccount}
                />
                <ActiveChats
                    sessions={sessions}
                    onArchive={handleArchive}
                    error={error}
                    isLoading={isLoadingData}
                    isArchivedPage={false}
                    title="Active Chats"
                />
            </div>

            <button className="fab" onClick={openModal} aria-label="Start new chat">
                <BsPlusCircleFill />
            </button>

            {isModalOpen && (
                <NewChatModal
                    users={availableUsersToChat}
                    onSelectUser={handleStartNewChat}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Dashboard;

/*
Explanation of Changes in `handleStartNewChat`:
- Corrected the `api.post` call based on successful Swagger test.
- Constructed the URL to include `?userId=<ID>` as a query parameter.
- Passed `null` as the second argument (request body) to `api.post`.
- Kept the `config` object (third argument) for the Authorization header.
- Added a check to ensure `selectedUser.userId` exists before proceeding.
- Updated console logs for clarity.
- Adjusted error handling slightly.
*/