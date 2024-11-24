import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const render = (
    <>
      <Navbar />
      <div>children</div>
    </>
  );
  return isAuthenticated ? render : <Navigate to="/login" />;
};

export default PrivateRoute;
