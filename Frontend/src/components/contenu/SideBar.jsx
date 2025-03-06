import { Link } from "react-router-dom";
import { Home, Settings, X , Mic} from "lucide-react";
import { useState } from "react";
import logo from "../../assets/images/logo.png";
import "../../assets/CSS/SideBar.css"

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);
  const userRole = localStorage.getItem("userRole");

  return (
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 z-40 overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      > 
      <button
        className="absolute top-4 right-4 lg:hidden"
        onClick={toggleSidebar}
      >
        <X size={24} />
      </button>

      <div className="flex justify-center items-center mb-8">
        <img src={logo} alt="Logo" className="w-20 h-20" />
      </div>

      <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Home size={20} />
          <span>Accueil</span>
        </Link>

        <Link to="#" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Mic size={20}/>
        <span>Concerts</span>
        </Link>

        

        <Link to="#" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} />
          <span>Paramètres</span>
        </Link>

        {userRole === "superadmin" && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-gray-700 font-semibold mb-2">Administration</h3>
            <Link to="#" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span>Liste des Admins</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};
