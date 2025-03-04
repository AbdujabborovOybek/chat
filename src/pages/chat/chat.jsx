import React, { useState, useEffect } from "react";
import "./chat.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://chat.abdujabborov.uz/", {
  transports: ["websocket"],
  auth: {
    user_id: JSON.parse(localStorage.getItem("user"))?.id || null,
  },
});

export const Chat = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([]);
    const chatOptions = { from: user.id, to: id };
    socket.emit("get_room", chatOptions);

    const handleRoom = (room) => {
      socket.emit("get_messages", { room_id: room });
      setRoom(room);
    };

    const handleMessages = (messages) => {
      setMessages(messages);
    };

    socket.on("get_room", handleRoom);
    socket.on("get_messages", handleMessages);

    return () => {
      socket.off("get_room", handleRoom);
      socket.off("get_messages", handleMessages);
    };
  }, [id, user.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    if (!message || !room) return;

    const messageOptions = {
      chat_id: room,
      message,
      from_user_id: user.id,
    };

    setMessages((prev) => [...prev, messageOptions]);
    socket.emit("send_message", messageOptions);
    e.target.reset();
  };

  return (
    <div className="chat-container">
      <ol className="chat-list">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`chat-list-item ${
              msg.from_user_id !== user.id
                ? "chat-list-item--i"
                : "chat-list-item--it"
            }`}
          >
            <div>
              <p>{msg.message}</p>
              <span>{new Date().toLocaleString("sv-SE")}</span>
            </div>
          </li>
        ))}
      </ol>

      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          name="message"
          placeholder="Type a message"
          autoComplete="off"
        />
        <button>Yuborish</button>
      </form>
    </div>
  );
};
