import "./layout.css";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export const Layout = () => {
  const socket = io("https://chat.abdujabborov.uz/", {
    transports: ["websocket"],
    auth: {
      user_id: JSON.parse(localStorage.getItem("user"))?.id || null,
    },
  });
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  const { id: activUser } = useParams();

  useEffect(() => {
    socket.emit("users");
    socket.on("users", (users) => setUsers(users));
  }, []);

  const openChat = (id) => {
    navigate(`/chat/${id}`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="layout">
      <aside className="sidebar">
        <input type="text" placeholder="Izlash" className="search" />
        <ol className="user_list">
          {users?.map((user) => (
            <li
              key={user.id}
              className={`user ${activUser === user.id ? "active" : ""}`}
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
        <button className="logout" onClick={logout}>
          Chiqish
        </button>
      </aside>
      <section>
        <Outlet />
      </section>
    </main>
  );
};
