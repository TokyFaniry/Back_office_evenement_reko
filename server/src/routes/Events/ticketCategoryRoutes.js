import express from "express";
import {
  createTicketCategory,
  getTicketCategoriesByEvent,
  updateTicketCategory,
  deleteTicketCategory,
} from "../../controllers/EventControllers/TicketCategoryController.js";

const router = express.Router();

// Créer une catégorie pour un événement
router.post("/", createTicketCategory);

// Récupérer toutes les catégories d'un événement (exemple : GET /api/ticket-categories/event/1)
router.get("/event/:eventId", getTicketCategoriesByEvent);

// Mettre à jour une catégorie par son id
router.put("/:id", updateTicketCategory);

// Supprimer une catégorie par son id
router.delete("/:id", deleteTicketCategory);

export default router;
