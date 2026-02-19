import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getRole } from "./auth";

export default function RequireRole({ allow }: { allow: "Admin" | "User" }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />;

  const role = getRole();
  if (!role) return <Navigate to="/" replace />;

  return <Outlet />;
}
