import React, { useState } from 'react';
import './Chat.css';
import SendIcon from '@mui/icons-material/Send';

const Chat = ({ onChatSubmit }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleUserMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage = `${newMessage}`;
    const updatedMessages = [...messages, { text: userMessage, type: 'user' }];
    setMessages(updatedMessages);

    // Clear the input field
    setNewMessage('');

    // Call the API for a response
    callAPI(updatedMessages, newMessage);
  };

  const callAPI = (chatHistory, userMessage) => {
    fetch('http://localhost:5000/check-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatHistory }),
    })
      .then((response) => response.json())
      .then((data) => {

        const aiReply = `AI: ${data.answer}`;
  
        // Update the chat with both the AI reply and user message
        const updatedMessages = [
          ...chatHistory,
          { text: aiReply, type: 'ai' },
        ];
  
        setMessages(updatedMessages);
  
        // Send the entire chat history to the parent component
        onChatSubmit(updatedMessages, data.results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="chat-container">
      <h2 className='chat-heading'>Search a Movie</h2>
      <div className="chat-messages">
        {console.log(messages)}
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.type === 'user' ? 'user-message' : 'ai-message'}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleUserMessage} className="sendbtn">
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Chat;
