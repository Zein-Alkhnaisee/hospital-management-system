import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // سبينر مؤقت حتى يكتمل تحميل الحالة
  }

  if (!isAuthenticated) {
    return <Navigate to="/contact" replace />;
  }

  return children;
};


export default ProtectedRoute;
