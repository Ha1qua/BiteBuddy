import React, { useEffect, useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]); // State to hold the chat messages

  useEffect(() => {
    // Here, we simulate receiving messages from the Chef
    const interval = setInterval(() => {
      // Check for new messages from the Chef
      // In a real app, use WebSocket or similar real-time communication to get these updates
      if (window.chefMessages && window.chefMessages.length) {
        setMessages([...window.chefMessages]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-container">
      <h2>Chef's Messages</h2>
      <div className="messages">
        {messages.length === 0 ? (
          <p>No new messages.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>Table {msg.tableNumber}: </strong>
              {msg.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Chat;
