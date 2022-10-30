import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

export const ProtectedRoute = (props) => {
  const token = useSelector((state) => state.authReducer.token);
  var decoded = !!token ? jwt_decode(token) : null;
 
  return !!decoded && props.authLevel == decoded.role ? <Outlet /> : <Navigate to="/login" />;
}