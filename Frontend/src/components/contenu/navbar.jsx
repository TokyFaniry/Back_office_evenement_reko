import React from "react";
import { Bell, Search, User, Menu } from "lucide-react";
import { Button } from "antd";

function Navbar({ toggleSidebar }) {

  
  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 bg-white shadow-md p-4 z-30">
      <div className="flex justify-between items-center">
        {/* Bouton du menu burger (visible uniquement en mode mobile) */}
        <button className="lg:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        {/* Barre de recherche */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Notifications et profil */}
        <div className="flex items-center space-x-6">
          {/* Bouton de notification */}
          <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Bell size={24} className="text-gray-600 hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
              3
            </span>
          </button>

          {/* Profil utilisateur */}
          <div className="flex items-center space-x-2">
            <User className="text-gray-600" size={24} />
            <span className="text-gray-800 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
