import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const AppLayout: React.FC = () => {
  return (
    <>
        <NavBar />
        <Outlet />
    </>
  );
}

export default AppLayout;