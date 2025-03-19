// src/components/Navbar.jsx
import React from "react";
import { Bell, Search, User, Menu } from "lucide-react";

function Navbar({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Bouton menu burger pour mobile */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            <Menu size={24} />
          </button>

          {/* Barre de recherche raccourcie */}
          <div className="mx-4 w-56">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="block w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Notifications et profil utilisateur */}
          <div className="flex items-center space-x-8">
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-semibold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition">
              <User size={24} className="text-gray-600" />
              <span className="text-gray-800 font-semibold tracking-wide">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
