// src/components/dashboard/ArchivedChats.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../../api';
import Topbar from '../shared/TopBar';
import Sidebar from '../shared/SideBar';
import ActiveChats from './ActiveChats'; // Reusing ActiveChats component
import '../../styles/Dashboard.css';

const ArchivedChats = () => {
    const [archivedSessions, setArchivedSessions] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null); // State for current user ID
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    // Fetch archived sessions AND current user ID
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = await getAccessTokenSilently();
                const config = { headers: { Authorization: `Bearer ${token}` } };

                console.log("ArchivedChats: Fetching history and account data...");
                // Fetch both concurrently
                const [historyResponse, accountResponse] = await Promise.all([
                    api.get('/History/Sessions', config),
                    api.get('/Account', config) // Need user ID for navigation state check in ChatPage
                ]);

                setArchivedSessions(historyResponse.data || []);
                setCurrentUserId(accountResponse.data?.userId); // Store the current user ID

                console.log("ArchivedChats: Successfully fetched archived sessions and user account. UserID:", accountResponse.data?.userId);
            } catch (err) {
                console.error("Error fetching archived data:", err.response || err);
                let specificError = "Unable to load archived chats or user data.";
                if (err.response && err.response.status === 401) {
                    specificError = "Authorization failed.";
                }
                setError(specificError);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [getAccessTokenSilently]);

    // Delete archived session (Permanent Delete)
    const handleDelete = async (sessionId) => {
        // (Logic remains the same as before - snipped for brevity)
        setError(null);
        try {
            const token = await getAccessTokenSilently();
            const config = { headers: { Authorization: `Bearer ${token}` } };
            console.log(`ArchivedChats: Deleting /History/Session/${sessionId} with token.`);
            await api.delete(`/History/Session/${sessionId}`, config);
            setArchivedSessions(prevSessions => prevSessions.filter(session => session.sessionId !== sessionId));
            console.log("ArchivedChats: Successfully deleted archived session:", sessionId);
        } catch (err) {
            console.error("Error deleting archived session:", err.response || err);
            let specificError = "Unable to delete archived chat.";
            if (err.response && err.response.status === 401) {
               specificError = "Authorization failed.";
            }
            setError(specificError);
        }
    };

    // Dummy handlers
    const handleStatusChange = async () => { /* Placeholder */ };
    const handleManageAccount = () => navigate('/profile');

    return (
        <div className="dashboard-container">
            <Topbar />
            <div className="dashboard-content">
                <Sidebar
                    onStatusChange={handleStatusChange}
                    onManageAccount={handleManageAccount}
                />
                {/* Pass correct props including currentUserId */}
                <ActiveChats
                    sessions={archivedSessions}
                    onArchive={handleDelete}
                    error={error}
                    isLoading={isLoading}
                    isArchivedPage={true}
                    title="Archived Chats"
                    // *** Pass currentUserId needed by ChatRow for navigation state ***
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    );
};

export default ArchivedChats;