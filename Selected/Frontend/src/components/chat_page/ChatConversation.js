// src/components/chat_page/ChatConversation.js
import React from 'react';
import ChatMessageBubble from './ChatMessageBubble';
import '../../styles/ChatPage.css';

/**
 * Renders the list of chat messages.
 *
 * @param {Array<object>} messages - Array of message objects. Each object should include senderName if needed for display.
 * @param {number|string} currentUserId - The ID of the currently logged-in user.
 */
const ChatConversation = ({ messages, currentUserId }) => {
  // Check if currentUserId is available before mapping
  if (currentUserId === undefined || currentUserId === null) {
      console.warn("ChatConversation: currentUserId is missing, cannot render messages correctly.");
      // Optionally render a placeholder or nothing
      return <main className="conversation-area"><div className="loading-msg-chat">Waiting for user info...</div></main>;
  }

  return (
    <main className="conversation-area">
      {messages.map(message => (
        <ChatMessageBubble
          key={message.messageId || message.id || `msg-${message.userId}-${message.createdOn}`} // More robust key
          message={message}
          currentUserId={currentUserId}
          // Extract senderName from the message object (ChatPage should add this)
          senderName={message.senderName}
        />
      ))}
    </main>
  );
};

export default ChatConversation;