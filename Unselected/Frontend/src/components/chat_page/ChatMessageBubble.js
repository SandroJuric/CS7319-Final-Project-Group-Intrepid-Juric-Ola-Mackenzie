// src/components/chat_page/ChatMessageBubble.js
import React from 'react';
import { BsCheck2All } from 'react-icons/bs';
import '../../styles/ChatPage.css';

/**
 * Renders a chat message bubble.
 *
 * Requires the message object (which should include senderName if needed)
 * and the ID of the current user viewing the chat.
 *
 * @param {object} message - The message object. Expected structure: { messageId, userId, content, createdOn, isRead, senderName? }
 * @param {number|string} currentUserId - The ID of the currently logged-in user viewing the chat.
 * @param {string} [senderName] - The display name of the sender (passed down from parent).
 */
const ChatMessageBubble = ({ message, currentUserId, senderName }) => {
  // Basic validation
  if (!message || typeof message.content === 'undefined' || currentUserId === undefined) {
    console.error("Invalid props passed to ChatMessageBubble:", { message, currentUserId });
    return <div className="message-bubble error">Invalid message data</div>; // Render an error state
  }

  // Determine if the message was sent by the current user by comparing user IDs.
  const isSentByMe = message.userId === currentUserId;

  const bubbleClass = isSentByMe ? 'message-bubble sent' : 'message-bubble received';

  // Format timestamp (optional but good practice)
  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return isoString; // Fallback to original string if date is invalid
    }
  };

  return (
    <div className={bubbleClass}>
      {/* For received messages, display sender's name if provided */}
      {!isSentByMe && senderName && (
        <span className="sender-name">{senderName}</span>
      )}
      <p>{message.content}</p>
      <div className="message-meta">
        <span className="message-time">{formatTime(message.createdOn)}</span>
        {/* For messages sent by the current user that have been read, display a read receipt icon */}
        {isSentByMe && message.isRead && (
          <BsCheck2All className="read-icon" title="Seen" />
        )}
      </div>
    </div>
  );
};

export default ChatMessageBubble;