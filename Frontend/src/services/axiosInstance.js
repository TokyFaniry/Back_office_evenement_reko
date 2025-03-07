// src/services/axiosInstance.js
import axios from "axios";

// Dans un environnement Vite, vous pouvez utiliser import.meta.env.VITE_BACKEND_URL.
// Ici, nous définissons explicitement la baseURL pour pointer vers le port 3000 et inclure le préfixe /api.
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout de 10 secondes
});

// Intercepteur de requêtes pour loguer la config avant l'envoi
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Requête envoyée :", config);
    return config;
  },
  (error) => {
    console.error("Erreur dans la requête :", error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour centraliser la gestion des erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Réponse reçue :", response);
    return response;
  },
  (error) => {
    console.error("Erreur dans la réponse :", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
