import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";


const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-pixpar-black text-pixpar-white flex flex-col">
      <AppNavbar />
      <main className="flex-1">
        <Outlet /> {/* Aquí se renderizan las rutas hijas */}
      </main>
    </div>
  );
};

export default Layout;
