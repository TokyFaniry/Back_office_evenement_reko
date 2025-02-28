import express from "express";
import eventRoutes from "./Events/event.js";
import ticketCategoryRoutes from "./Events/ticketCategoryRoutes.js";

const routers = express.Router();

routers.use("/events", eventRoutes);
routers.use("/ticket-categories", ticketCategoryRoutes);

export default routers;
