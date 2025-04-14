import React from 'react';
import { BsX } from 'react-icons/bs'; // Icon for the close button
import '../../styles/Dashboard.css'; // We'll add modal styles here

// I created this new component specifically for the "Start New Chat" modal.
const NewChatModal = ({ users, onSelectUser, onClose }) => {
  return (
    // The overlay div dims the background
    <div className="modal-overlay" onClick={onClose}> 
      {/* Prevent clicks inside the modal content from closing it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <BsX />
        </button>
        <h3 className="modal-title">Start New Chat</h3>
        
        {/* I check if there are any users available to chat with */}
        {users && users.length > 0 ? (
          <div className="user-list-modal">
            {/* Map through the available users passed as props */}
            {users.map((user) => (
              <div 
                key={user.userId} 
                className="user-row-modal" 
                onClick={() => onSelectUser(user)} // Call the handler passed from DashboardPage
                role="button" // Indicate it's clickable
                tabIndex={0} // Make it keyboard focusable
                onKeyDown={(e) => e.key === 'Enter' && onSelectUser(user)} // Allow Enter key selection
              >
                {/* Display the user's email (or name if you add it later) */}
                <span className="user-name">{user.email || 'Unknown User'}</span>
              </div>
            ))}
          </div>
        ) : (
          // Show a message if no users are available
          <div className="no-data">No new users available to chat with.</div>
        )}
      </div>
    </div>
  );
};

export default NewChatModal;

/*
Explanation:
- This is a simple presentational component for the modal.
- It receives the filtered list of 'users', the 'onSelectUser' function (which is handleStartNewChat from DashboardPage), and the 'onClose' function.
- It renders an overlay, the modal content area, a title, and a close button.
- It maps over the 'users' array to display each user in a clickable row (`.user-row-modal`).
- Clicking a user row triggers the `onSelectUser` function passed in via props.
- Clicking the overlay or the close button triggers the `onClose` function.
- Added basic accessibility attributes (`role`, `tabIndex`, `onKeyDown`).
*/