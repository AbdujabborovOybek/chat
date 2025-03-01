import "./layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export const Layout = () => {
  const socket = io("http://localhost:8080", { transports: ["websocket"] });
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("users");
    socket.on("users", (users) => setUsers(users));
  }, []);

  const openChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <main className="layout">
      <aside className="sidebar">
        <input type="text" placeholder="Izlash" className="search" />
        <ol className="user_list">
          {users?.map((user) => (
            <li
              key={user.id}
              className="user"
              onClick={() => openChat(user.id)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219988.png"
                alt="User"
              />
              <div>
                <h4>{user?.fullanme}</h4>
                <p>{user?.phone}</p>
              </div>
            </li>
          ))}
        </ol>
        <button className="logout">Chiqish</button>
      </aside>
      <section>
        <Outlet />
      </section>
    </main>
  );
};

// created_at: "2025-02-18T12:04:22.000Z";
// fullanme: null;
// id: "2690ef69-cb78-4385-84cb-cf3db54bee54";
// phone: "+998 90 695 7132";
