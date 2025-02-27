import express from "express";
import eventRoutes from "./Events/event.js";

const routers = express.Router();

routers.use("/events", eventRoutes);

export default routers;
