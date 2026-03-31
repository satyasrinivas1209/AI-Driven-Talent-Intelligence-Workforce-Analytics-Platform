import { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, X } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: 'Hello! Ask me about HR policies, leave, or salary.', sender: 'bot' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    
    try {
      // Connect to Python ML Chatbot
      const res = await axios.post('http://127.0.0.1:5001/chatbot', { question: userMsg });
      setMessages(prev => [...prev, { text: res.data.answer, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: 'Sorry, the HR bot service is currently down.', sender: 'bot' }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chat-window ${!isOpen ? 'closed' : ''}`}>
        <div className="chat-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <MessageSquare size={18} />
            HR Assistant AI
          </div>
          <X 
            size={18} 
            style={{cursor: 'pointer'}} 
            onClick={() => setIsOpen(false)} 
          />
        </div>
        
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.sender}`}>
              {m.text}
            </div>
          ))}
        </div>
        
        <div className="chat-input-area">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type your question..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{margin: 0, border: 'none'}}
          />
          <button className="btn" style={{padding: '0.5rem'}} onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
      
      {!isOpen && (
        <div className="chat-btn" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
