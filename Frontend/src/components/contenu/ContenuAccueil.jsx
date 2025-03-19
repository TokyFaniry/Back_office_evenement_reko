// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";

function ContenuAccueil({ events }) {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="group relative aspect-square block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
        >
          {event.image?.imageUrl ? (
            <img
              src={event.image.imageUrl}
              alt={event.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-200 w-full h-full">
              <span className="text-gray-500">Pas d'image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-semibold truncate">{event.title}</h3>
            <p className="text-sm truncate">
              {event.location} •{" "}
              {event.date && new Date(event.date).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function AddEventFAB() {
  return (
    <Link to="/ajoutEvents">
      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 transition-transform duration-300 hover:scale-110">
        <Plus size={24} />
      </button>
    </Link>
  );
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    axiosInstance
      .get("/events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Fetch events error:", error));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-4 pb-8">
      {events.length > 0 ? (
        <ContenuAccueil events={events} />
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-500">Aucun événement à afficher</p>
        </div>
      )}
      <AddEventFAB />
    </div>
  );
}
