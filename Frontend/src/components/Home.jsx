// Home.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./contenu/SideBar";
import Navbar from "./contenu/navbar";
import ContenuAccueil from "./contenu/ContenuAccueil";

export function Home() {
  return (
    <div className="relative min-h-screen">
      <ContenuAccueil />
      <Outlet />
    </div>
  );
}
