import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

const AppLayout: React.FC = () => {
  return (
    <>
        <NavBar />
        <Outlet />
        <Footer />
    </>
  );
}

export default AppLayout;