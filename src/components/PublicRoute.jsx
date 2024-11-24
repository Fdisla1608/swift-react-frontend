import React from "react";
import LogOutNavbar from "./LogOutNavbar";

const PublicRoute = ({ children }) => {
  return (
    <>
      <LogOutNavbar />
      <div>{children}</div>
    </>
  );
};

export default PublicRoute;
