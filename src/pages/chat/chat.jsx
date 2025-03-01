import React from "react";
import "./chat.css";
import { useParams } from "react-router-dom";

export const Chat = () => {
  const { id } = useParams();

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    e.target.reset();
  };

  return (
    <div className="chat-container">
      <ol className="chat-list">
        <li className="chat-list-item chat-list-item--i">
          <div>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Suscipit, eum! Beatae, numquam.
            </p>
            <span>{new Date().toLocaleString("sv-SE")}</span>
          </div>
        </li>

        <li className="chat-list-item chat-list-item--it">
          <div>
            <p>Lorem, ipsum dolor sit amet</p>
            <span>{new Date().toLocaleString("sv-SE")}</span>
          </div>
        </li>

        <li className="chat-list-item chat-list-item--it">
          <div>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde
              omnis minus repellat enim, exercitationem dicta reiciendis
              praesentium ducimus, est corporis id doloremque aspernatur aliquid
              vitae incidunt ipsum nostrum nihil sequi?
            </p>
            <span>{new Date().toLocaleString("sv-SE")}</span>
          </div>
        </li>
        <li className="chat-list-item chat-list-item--i">
          <div>
            <p>
              Lorem, ipsum dolor sit amet
            </p>
            <span>{new Date().toLocaleString("sv-SE")}</span>
          </div>
        </li>
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
