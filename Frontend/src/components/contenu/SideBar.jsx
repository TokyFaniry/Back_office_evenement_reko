import { Link } from "react-router-dom";
import { Home, Settings, X, Mic } from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const userRole = localStorage.getItem("userRole");

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white/70 backdrop-blur-md border-r border-gray-200 p-6 z-50 overflow-y-auto transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <button
        className="absolute top-4 right-4 lg:hidden text-gray-700 hover:text-gray-900 transition-colors"
        onClick={toggleSidebar}
      >
        <X size={24} />
      </button>

      <div className="flex justify-center items-center mb-10">
        <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
      </div>

      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-xl transition-colors duration-150"
        >
          <Home size={20} className="mr-3" />
          <span className="font-medium">Accueil</span>
        </Link>

        <Link
          to="#"
          className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-xl transition-colors duration-150"
        >
          <Mic size={20} className="mr-3" />
          <span className="font-medium">Concerts</span>
        </Link>

        <Link
          to="#"
          className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-xl transition-colors duration-150"
        >
          <Settings size={20} className="mr-3" />
          <span className="font-medium">Paramètres</span>
        </Link>

        {userRole === "superadmin" && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="px-4 text-gray-600 text-sm font-semibold mb-2">
              Administration
            </h3>
            <Link
              to="#"
              className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-xl transition-colors duration-150"
            >
              <span className="font-medium">Liste des Admins</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
