import React from "react";

const Message = ({ message }) => {
  console.log("Received message:", message); // Add this line to debug

  return (
    <div>
      <h1>Messages</h1>
      <div>{message ? <p>{message}</p> : <p>No messages yet.</p>}</div>
    </div>
  );
};

export default Message;
