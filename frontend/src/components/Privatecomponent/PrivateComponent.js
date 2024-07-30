import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateComponent = () => {
  const auth = localStorage.getItem("data");
  return auth ? (
    <>
      <Outlet /> {/* Render the child components */}
    </>
  ) : (
    // this is required usman to navigate when you have auth
    <Navigate to="/login" />
  );
};

export default PrivateComponent;
