import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './Chat.css';

export default function AiChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi Timmy! I'm Lumio. Ask me any word you don't understand!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    
    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "That's a great question! 'Magical' means something wonderful and exciting, like magic!", 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <h1>🤖 Chat with Lumio</h1>
      
      <div className="card chat-box">
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
        </div>
        
        <form className="chat-input" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Type your question here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary send-btn">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
