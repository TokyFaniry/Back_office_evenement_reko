import express from "express";
import upload from "../../middleware/upload.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../../controllers/EventControllers/EventsControllers.js";

const router = express.Router();

router.post("/", upload.single("poster"), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", upload.single("poster"), updateEvent);
router.delete("/:id", deleteEvent);

export default router;
