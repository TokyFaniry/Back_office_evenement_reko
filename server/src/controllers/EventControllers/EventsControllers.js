// src/controllers/EventControllers/EventsControllers.js

import path from "path";
import db from "../../models/event/index.js";
import sequelize from "../../config/database.js";
import { deleteFile, UPLOAD_PATH } from "./fileUtils.js"; // Supposons que deleteFile soit extrait dans fileUtils.js
import { io } from "../../config/socket.js"; // Import de l'instance Socket.IO

const { Event, Image, Ticket, TicketCategory } = db;

// ----------------------------------------------------------------------------
// 📌 Créer un événement avec une image et émission d'un événement Socket.IO
// ----------------------------------------------------------------------------
export const createEvent = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { date, description, location, totalSeats, type, title } = req.body;

    if (
      !req.file ||
      !date ||
      !description ||
      !location ||
      !totalSeats ||
      !type ||
      !title
    ) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const newEvent = await Event.create(
      { date, description, location, totalSeats, type, title },
      { transaction }
    );

    // Stocker l'URL relative de l'image
    await Image.create(
      {
        eventId: newEvent.id,
        imageUrl: `/uploads/events/${req.file.filename}`,
      },
      { transaction }
    );

    // Finaliser la transaction
    await transaction.commit();

    // Récupérer l'événement complet avec son image associée
    const completeEvent = await Event.findByPk(newEvent.id, {
      include: [{ model: Image, as: "image", attributes: ["imageUrl"] }],
    });

    // Émettre l'événement "new_event" pour notifier le frontoffice
    io.emit("new_event", completeEvent);

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      event: completeEvent,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    if (req.file) {
      try {
        await deleteFile(req.file.filename);
      } catch (delError) {
        console.error(
          "Erreur lors de la tentative de suppression après échec :",
          delError.message
        );
      }
    }
    console.error("Erreur lors de la création de l'événement :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ----------------------------------------------------------------------------
// 📌 Obtenir tous les événements
// ----------------------------------------------------------------------------
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: Image, as: "image", attributes: ["imageUrl"] }],
      order: [["date", "ASC"]],
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ----------------------------------------------------------------------------
// 📌 Obtenir un événement par ID
// ----------------------------------------------------------------------------
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: [
        { model: Image, as: "image", attributes: ["imageUrl"] },
        {
          model: Ticket,
          as: "tickets",
          include: [
            { model: TicketCategory, as: "category", attributes: ["name"] },
          ],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ----------------------------------------------------------------------------
// 📌 Mettre à jour un événement avec image et émission d'un événement Socket.IO
// ----------------------------------------------------------------------------
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { date, description, location, totalSeats } = req.body;
  // URL de la nouvelle image (si envoyée)
  const newImageUrl = req.file ? `/uploads/events/${req.file.filename}` : null;

  const transaction = await sequelize.transaction();
  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    await event.update(
      { date, description, location, totalSeats },
      { transaction }
    );

    if (newImageUrl) {
      const existingImage = await Image.findOne({
        where: { eventId: id },
        transaction,
      });

      if (existingImage) {
        // Supprimer l'ancienne image du système de fichiers
        await deleteFile(existingImage.imageUrl);
        await existingImage.update({ imageUrl: newImageUrl }, { transaction });
      } else {
        await Image.create(
          { eventId: id, imageUrl: newImageUrl },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const updatedEvent = await Event.findByPk(id, {
      include: [{ model: Image, as: "image", attributes: ["imageUrl"] }],
    });

    // Émettre l'événement "update_event" pour notifier le frontoffice
    io.emit("update_event", updatedEvent);

    res
      .status(200)
      .json({ message: "Événement mis à jour", event: updatedEvent });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ----------------------------------------------------------------------------
// 📌 Supprimer un événement et son image, et émission d'un événement Socket.IO
// ----------------------------------------------------------------------------
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    const image = await Image.findOne({ where: { eventId: id }, transaction });
    if (image) {
      await deleteFile(image.imageUrl);
      await image.destroy({ transaction });
    }

    await event.destroy({ transaction });
    await transaction.commit();

    // Émettre l'événement "delete_event" avec l'ID de l'événement supprimé
    io.emit("delete_event", { id });

    res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
