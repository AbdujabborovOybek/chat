import { Outlet, useLocation, Navigate } from "react-router-dom";

export const Auth = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (token) return <Outlet />;
  return <Navigate to="/login" state={{ from: location.pathname }} />;
};
