import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../..//controllers/EventControllers/TicketControllers.js";
import { validateTicketInput } from "../../middleware/ticketValidation.js";

const router = express.Router();

router.post("/", validateTicketInput, createTicket);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.put("/:id", validateTicketInput, updateTicket);
router.delete("/:id", deleteTicket);

export default router;
