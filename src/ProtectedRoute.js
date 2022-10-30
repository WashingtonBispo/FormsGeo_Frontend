import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

export const ProtectedRoute = (props) => {
  const token = useSelector((state) => state.authReducer.token);
  const decoded = !!token ? jwt_decode(token) : null;
  const authLevelCond = !!decoded && (props.authLevel == decoded.role || decoded.role == "Admin");
 
  return authLevelCond ? <Outlet /> : <Navigate to="/login" />;
}