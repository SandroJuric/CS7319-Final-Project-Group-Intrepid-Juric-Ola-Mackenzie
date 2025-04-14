import React from 'react';
import ChatRow from './ChatRow';
import '../../styles/Dashboard.css';

const ChatList = ({ sessions, onArchive, isArchivedPage }) => {
  return (
    <div className="chat-list">
      {sessions.map((session) => (
        <ChatRow 
          key={session.sessionId} 
          session={session} 
          onArchive={onArchive} 
          isArchivedPage={isArchivedPage} 
        />
      ))}
    </div>
  );
};

export default ChatList;

/*
Explanation:
- ChatList iterates over the sessions and renders a ChatRow for each.
- The isArchivedPage prop is passed along so that each ChatRow knows which icon to render.
*/
