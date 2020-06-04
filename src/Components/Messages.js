import React, { useEffect, useRef } from "react";

export default function Messages(props) {
  const { messages } = props;
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);
  return (
    <div className="messages">
      {messages.map((m, index) => renderMessage(m, index))}
      <div ref={messagesEndRef} />
    </div>
  );

  function renderMessage(message, index) {
    const { member, text } = message;
    const { currentMember } = props;
    const myMessages = currentMember.id === member.id;
    const className = myMessages ? "current-member" : "message";

    return (
      <div className={className} key={index}>
        <div className="message-container">
          <div className="username">{member.clientData.username}</div>
          <div
            className="message-content"
            style={{ backgroundColor: member.clientData.color }}
          >
            {text}
          </div>
        </div>
      </div>
    );
  }
}
