// src/components/chat_page/ChatInput.js
import React, { useState } from 'react';
import { BsSendFill } from 'react-icons/bs';
import '../../styles/ChatPage.css';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <footer className="message-input-area">
      <div className="input-container">
        <textarea
          className="message-input"
          placeholder="Type your message..."
          rows="1"
          value={message}
          onChange={e => setMessage(e.target.value)}
        ></textarea>
        <button className="send-btn" onClick={handleSend}>
          <BsSendFill />
        </button>
      </div>
    </footer>
  );
};

export default ChatInput;
/*
Explanation:
ChatInput.js provides a text area for composing messages and a send button.
I manage local state for the message input and trim the message before sending to avoid empty messages.
The onSend function (passed from ChatPage.js) is called with the trimmed message.
*/
