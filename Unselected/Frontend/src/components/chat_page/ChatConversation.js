// src/components/chat_page/ChatConversation.js
import React from 'react';
import ChatMessageBubble from './ChatMessageBubble';
import '../../styles/ChatPage.css';

const ChatConversation = ({ messages, currentUserName }) => {
  return (
    <main className="conversation-area">
      {messages.map(message => (
        <ChatMessageBubble 
          key={message.messageId || message.id} 
          message={message} 
          currentUserName={currentUserName} 
        />
      ))}
    </main>
  );
};

export default ChatConversation;

/*
Explanation:
ChatConversation.js maps over the messages array and renders each message using the ChatMessageBubble component.
I pass the currentUserName prop so that each bubble can decide whether to apply "sent" or "received" styling.
*/
