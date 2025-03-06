import { Link } from "react-router-dom";
import { Home, Shirt, Music, Settings, ChevronDown, ShoppingBag, Package, Crown, Gem, Tag, X , PackageSearch} from "lucide-react";
import { useState } from "react";
import logo from "../../assets/images/logo.png";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);
  // Récupérer le rôle de l'utilisateur depuis le localStorage
  const userRole = localStorage.getItem("userRole");

  return (
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 z-40 overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      > 
      {/* Bouton de fermeture (croix) en mode mobile */}
      <button
        className="absolute top-4 right-4 lg:hidden"
        onClick={toggleSidebar}
      >
        <X size={24} />
      </button>

      {/* Logo centré */}
      <div className="flex justify-center items-center mb-8">
        <img src={logo} alt="Logo" className="w-20 h-20" />
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home size={20} />
          <span>Accueil</span>
        </Link>

        <Link
        to="/stock"
        className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
        <PackageSearch size={20}/>
        <span>Stock</span>
        </Link>

        {/* Menu déroulant "Ajouter" */}
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Package size={20} />
              <span>Produit</span>
            </div>
            <ChevronDown size={20} className={`${isOpen ? "rotate-180" : ""} transition-transform`} />
          </button>
          {isOpen && (
            <div className="pl-6 mt-1 space-y-2">
              <Link to="/teeshirt" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Shirt size={16} />
                <span>Teeshirt</span>
              </Link>
              <Link to="/album" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Music size={16} />
                <span>Album</span>
              </Link>
              <Link to="/carnet" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Package size={16} />
                <span>Carnet</span>
              </Link>
              <Link to="/tote" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingBag size={16} />
                <span>Tote Bag</span>
              </Link>
              <Link to="/casquette" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Crown size={16} />
                <span>Casquette</span>
              </Link>
              <Link to="/hoodie" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Shirt size={16} />
                <span>Hoodie</span>
              </Link>
              <Link to="/coussin" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Package size={16} />
                <span>Coussin</span>
              </Link>
              <Link to="/bracelet" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Gem size={16} />
                <span>Bracelet</span>
              </Link>
              <Link to="/autocollant" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Tag size={16} />
                <span>Autocollant</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/settings"
          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings size={20} />
          <span>Paramètres</span>
        </Link>

        {/* Section Administration pour SuperAdmin */}
        {userRole === "superadmin" && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-gray-700 font-semibold mb-2">Administration</h3>
            <Link
              to="/admin-list"
              className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Liste des Admins</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
