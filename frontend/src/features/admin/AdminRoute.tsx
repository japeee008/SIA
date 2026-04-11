import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;