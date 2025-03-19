import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

// Composant d'affichage des événements (le bouton "+" dans la grille a été supprimé)
function ContenuAccueil({ events }) {
  return (
    <div className="absolute top-[5.5rem] left-0 md:left-[16rem] w-full md:w-[84%] p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="group h-[200px] sm:h-[300px] flex justify-center items-center"
        >
          <div className="relative w-full h-full bg-white rounded-lg overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-[rgba(177,177,177,0.5)] rounded-lg transition-colors duration-300 group-hover:bg-[rgba(155,155,155,0.7)]"></div>
            {event.image && event.image.imageUrl && (
              <img
                src={event.image.imageUrl}
                alt={event.title}
                className="absolute inset-0 object-cover w-full h-full"
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

// Composant Floating Action Button qui redirige vers /ajoutEvents
function AddEventFAB() {
  return (
    <Link to="/ajoutEvents">
      <button className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50">
        <Plus size={24} />
      </button>
    </Link>
  );
}

// Composant parent fusionnant l'affichage et le FAB
export default function Dashboard() {
  const [events, setEvents] = useState([]);

  // Fonction pour récupérer la liste des événements
  const fetchEvents = () => {
    axiosInstance
      .get("/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des événements :", error);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="relative min-h-screen">
      <ContenuAccueil events={events} />
      <AddEventFAB />
    </div>
  );
}
