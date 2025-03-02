import { Outlet, useLocation, Navigate } from "react-router-dom";

export const Auth = () => {
  const user = localStorage.getItem("user");
  const location = useLocation();
  if (user) return <Outlet />;
  return <Navigate to="/login" state={{ from: location.pathname }} />;
};
