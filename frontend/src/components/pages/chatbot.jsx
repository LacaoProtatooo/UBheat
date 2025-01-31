import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const API_URL = "api/chat";

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to the conversation
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    console.log('Sending message:', input);

    try {
      const response = await axios.post(API_URL, { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput('');
  };

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '70%', padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handleSend} style={{ padding: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
