import { Outlet, useLocation, Navigate } from "react-router-dom";

export const Auth = () => {
  const auth = localStorage.getItem("token");
  const location = useLocation();
  if (auth) return <Outlet />;
  return <Navigate to="/login" state={{ from: location.pathname }} />;
};
