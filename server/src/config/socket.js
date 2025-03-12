// src/config/socket.js
import { Server } from "socket.io";

let io;

/**
 * Initialise l’instance Socket.IO et l’attache au serveur HTTP.
 * @param {http.Server} server - L’instance du serveur HTTP.
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5174", // Adresse du frontoffice
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connecté : ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client déconnecté : ${socket.id}`);
    });
  });
};

/**
 * Retourne l’instance Socket.IO si elle est initialisée.
 * Sinon, lance une erreur explicite.
 */
export const getSocketIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO n'est pas initialisé. Veuillez appeler initSocket(server) dans server.js."
    );
  }
  return io;
};

export { io };
