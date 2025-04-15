// src/components/dashboard/ChatRow.js
import React from 'react';
import { BsClockHistory } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css'; // Make sure this contains the new CSS class

// Props: session, onArchive, isArchivedPage
const ChatRow = ({ session, onArchive, isArchivedPage }) => {
  const navigate = useNavigate();

  // Navigate to the chat page ONLY IF it's NOT an archived page.
  const handleRowClick = () => {
    // *** KEY CHANGE: Check if the page is for archived chats ***
    if (isArchivedPage) {
      console.log(`ChatRow: Clicked on archived session ${session?.sessionId} - navigation disabled.`);
      return; // Do nothing if it's an archived chat row
    }

    // Original navigation logic (only runs for active chats)
    if (!session) {
        console.error("ChatRow: Missing session data for navigation");
        return;
    }
    console.log(`ChatRow: Navigating to chat session: ${session.sessionId}`);
    // Pass isArchived: false explicitly, though ChatPage might default anyway
    navigate('/chat', { state: { session: session, isArchived: false } });
  };

  // Archive (or delete) button handler stops propagation to avoid triggering navigation.
  const handleArchive = (e) => {
    e.stopPropagation(); // Keep this to prevent row click
    console.log(isArchivedPage ? "Deleting session with ID:" : "Archiving session with ID:", session?.sessionId);
    if (session?.sessionId) { // Add a check for session ID
        onArchive(session.sessionId);
    } else {
        console.error("ChatRow: Cannot archive/delete - session ID missing.");
    }
  };

  // Build display string for participants. Needs currentUserId ideally, but fallback provided
  // Note: This simple join might not be ideal if currentUserId isn't passed down to filter self out.
  const participants = session?.users?.map(user => user.userName || ``) || [];
  const displayName = participants.join('\'s Chat with ') || `Session ${session?.sessionId || 'N/A'}`;

  // Only display recent message if available.
  let recentMessage = null;
  // Check session.messages exists and is an array
  if (Array.isArray(session?.messages) && session.messages.length > 0) {
    const lastMsg = session.messages[session.messages.length - 1];
    recentMessage = lastMsg?.content || ""; // Check content exists
  }

  // *** Add conditional CSS class based on isArchivedPage ***
  const rowClassName = `user-row ${isArchivedPage ? 'archived-row-nonclickable' : ''}`;

  return (
    // *** Apply the conditional class name and the modified click handler ***
    <div className={rowClassName} onClick={handleRowClick}>
      <div className="user-info">
        <span className="user-name">{displayName}</span>
        {recentMessage && (
          <div className="chat-recent-message">{recentMessage}</div>
        )}
      </div>
      {/* Keep the archive/delete icon logic */}
      <div className="history-icon" onClick={handleArchive} title={isArchivedPage ? "Delete Permanently" : "Archive Chat"}>
        {isArchivedPage ? (
          // Use the specific class for the delete icon
          <span className="delete-icon" >x</span>
        ) : (
          <BsClockHistory />
        )}
      </div>
    </div>
  );
};

export default ChatRow;