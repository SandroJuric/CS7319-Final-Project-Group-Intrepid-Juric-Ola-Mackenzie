// src/components/chat_page/ChatMessageBubble.js
import React from 'react';
import { BsCheck2All } from 'react-icons/bs';
import '../../styles/ChatPage.css';

const ChatMessageBubble = ({ message, currentUserName }) => {
  // Determine if the message was sent by the current user.
  // If the 'sent' property exists, use it; otherwise, compare senderName.
  const isSent = message.hasOwnProperty('sent') ? !message.sent : (message.senderName !== currentUserName);

  const bubbleClass = isSent ? 'message-bubble sent' : 'message-bubble received';

  return (
    <div className={bubbleClass}>
      {/* For received messages, display sender's name if available */}
      {!isSent && message.senderName && (
        <span className="sender-name">{message.senderName}</span>
      )}
      <p>{message.content}</p>
      <div className="message-meta">
        <span className="message-time">{message.createdOn}</span>
        {/* For sent messages that have been read, display a read receipt icon */}
        {isSent && message.isRead && (
          <BsCheck2All className="read-icon" title="Seen" />
        )}
      </div>
    </div>
  );
};

export default ChatMessageBubble;

/*
Explanation:
In ChatMessageBubble.js, I decide whether to style a message as sent or received by checking the "sent" flag if available.
If not, I compare the message's senderName with the currentUserName.
Sent messages are styled with the "sent" class and, if marked as read (isRead true), a read receipt icon is shown.
For received messages, the sender's name is displayed (if provided).
*/
