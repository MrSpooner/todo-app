import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const token = useAppSelector((s) => s.auth.token);
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}

