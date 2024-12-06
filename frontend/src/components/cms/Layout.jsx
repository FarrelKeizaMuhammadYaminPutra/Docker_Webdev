import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div className="tw-flex">
        <Sidebar />
        <div className="tw-w-full tw-ml-16 md:tw-ml-56">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

