// src/components/dashboard/ActiveChats.js
import React from 'react';
import ChatList from './ChatList';
import '../../styles/Dashboard.css';

// Modified to accept and pass down currentUserId
const ActiveChats = ({
    sessions,
    onArchive,
    error,
    isArchivedPage = false,
    isLoading = false,
    title = "Active Chats",
    currentUserId // Added prop
}) => {

    const noDataMessage = isArchivedPage ? "No archived chats available." : "No active chats available.";

    return (
        <main className="dashboard-main">
            <h2>{title}</h2>
            {isLoading && <div className="loading-msg">Loading chats...</div>}
            {!isLoading && error && <div className="error-msg">{error}</div>}
            {!isLoading && !error && sessions && sessions.length > 0 ? (
                <ChatList
                    sessions={sessions}
                    onArchive={onArchive}
                    isArchivedPage={isArchivedPage}
                    currentUserId={currentUserId} // *** Pass down currentUserId ***
                />
            ) : (
                !isLoading && !error && <div className="no-data">{noDataMessage}</div>
            )}
        </main>
    );
};

export default ActiveChats;