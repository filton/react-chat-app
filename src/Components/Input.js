import React, { useState } from "react";

export default function Input(props) {
  const [input, setInput] = useState({
    content: "",
  });

  const onChange = (event) => {
    setInput({ content: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const regex = /^\s+$/;
    if (input.content.match(regex)) return;
    setInput({ content: "" });
    props.onSendMessage(input.content);
  };

  return (
    <div className="input">
      <form onSubmit={(event) => onSubmit(event)}>
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(event) => onChange(event)}
          value={input.content}
          autoFocus={true}
        />
        <button disabled={!input.content}>Send</button>
      </form>
    </div>
  );
}
