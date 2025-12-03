import React, { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  const ref = useRef();
  
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  const username = localStorage.getItem("username");

  return (
    <div className="messages-container" ref={ref}>
      {messages.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          padding: '40px',
          fontSize: '14px'
        }}>
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((m, i) => {
          // Create a better unique key
          const messageKey = `${m.sender}-${m.time || i}-${i}`;
          
          return (
            <div 
              key={messageKey} 
              className={`message ${m.sender === username ? 'sent' : 'received'}`}
            >
              <div>
                <div className="message-sender">{m.sender}</div>
                <div className="message-bubble">{m.message}</div>
                <div className="message-time">
                  {new Date(m.time || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}