import express from "express";
import eventRoutes from "./Events/event.js";
import ticketCategoryRoutes from "./Events/ticketCategory.js";
import ticketRoutes from "./Events/ticket.js";

const routers = express.Router();

routers.use("/events", eventRoutes);
routers.use("/ticket-categories", ticketCategoryRoutes);
routers.use("/tickets", ticketRoutes);

export default routers;
