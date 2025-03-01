import { Routes, Route } from "react-router-dom";
import { Layout } from "./layout/layout";
import { Login } from "./pages/auth/login";
import { Auth } from "./pages/auth/auth";
import { Verify } from "./pages/auth/verify";
import { Chat } from "./pages/chat/chat";

const Profile = () => {
  return <h1>My Profile</h1>;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="verify" element={<Verify />} />
      <Route path="/" element={<Layout />}>
        <Route element={<Auth />}>
          <Route index element={<Profile />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Route>
      </Route>
    </Routes>
  );
};
