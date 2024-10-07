import React from "react";
import Sidebar from "./Sidebar";
import "./css/sidebarLayout.css";

interface SidebarLayoutProps {
  children: React.ReactNode; // Child components will be passed here
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="content-area">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
