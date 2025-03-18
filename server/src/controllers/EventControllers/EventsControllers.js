import path from "path";
import db from "../../models/event/index.js";
import sequelize from "../../config/database.js";
import { deleteFile, UPLOAD_PATH } from "./fileUtils.js";
import { getSocketIO } from "../../config/socket.js";

const { Event, Image, Ticket, TicketCategory } = db;

// ----------------------------------------------------------------------------
// 📌 Créer un événement avec une image et émission d'un événement Socket.IO
// ----------------------------------------------------------------------------
export const createEvent = async (req, res) => {
  try {
    // Extraction des nouveaux champs "heure" et "etatDeBillets" (optionnel)
    const {
      date,
      heure,
      description,
      location,
      totalSeats,
      type,
      title,
      etatDeBillets,
    } = req.body;
    if (
      !req.file ||
      !date ||
      !heure ||
      !description ||
      !location ||
      !totalSeats ||
      !type ||
      !title
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const newEvent = await sequelize.transaction(async (transaction) => {
      // Création de l'événement en incluant les nouveaux champs.
      const event = await Event.create(
        {
          date,
          heure,
          description,
          location,
          totalSeats,
          type,
          title,
          etatDeBillets,
        },
        { transaction }
      );

      // Fallback pour obtenir l'host. Si req.get("host") est absent, on utilise "localhost:3001"
      const host = req.get("host") || "localhost:3001";
      // Construction d'une URL absolue valide pour l'image
      const imageUrl = `${req.protocol}://${host}/uploads/events/${req.file.filename}`;
      console.log("Création de l'URL de l'image :", imageUrl);

      // Création de l'image associée à l'événement
      await Image.create({ eventId: event.id, imageUrl }, { transaction });

      return event;
    });

    const completeEvent = await Event.findByPk(newEvent.id, {
      include: [{ model: Image, as: "image", attributes: ["imageUrl"] }],
    });

    const io = getSocketIO();
    io.emit("new_event", completeEvent);

    return res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      event: completeEvent,
    });
  } catch (error) {
    if (req.file) {
      try {
        await deleteFile(req.file.filename);
      } catch (delError) {
        console.error(
          "Erreur lors de la suppression du fichier après échec :",
          delError.message
        );
      }
    }
    console.error("Erreur lors de la création de l'événement :", error.message);
    return res.status(500).json({
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
    return res.status(200).json(events);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements :",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// ----------------------------------------------------------------------------
// 📌 Obtenir un événement par ID
// ----------------------------------------------------------------------------
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      attributes: [
        "id",
        "title",
        "description",
        "date",
        "heure",
        "location",
        "totalSeats",
        "type",
      ],
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["imageUrl"],
        },
        {
          model: Ticket,
          as: "tickets",
          include: [
            {
              model: TicketCategory,
              as: "category",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'événement ${id} :`,
      error.message
    );
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// ----------------------------------------------------------------------------
// 📌 Mettre à jour un événement avec une image et émission d'un événement Socket.IO
// ----------------------------------------------------------------------------
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  // Extraction des nouveaux champs dans le body
  const { date, heure, description, location, totalSeats, etatDeBillets } =
    req.body;
  const newImageUrl = req.file
    ? `${req.protocol}://${
        req.get("host") || "localhost:3001"
      }/uploads/events/${req.file.filename}`
    : null;

  const existingEvent = await Event.findByPk(id);
  if (!existingEvent) {
    return res.status(404).json({ message: "Événement non trouvé" });
  }

  try {
    await sequelize.transaction(async (transaction) => {
      await existingEvent.update(
        { date, heure, description, location, totalSeats, etatDeBillets },
        { transaction, returning: true }
      );

      if (newImageUrl) {
        const existingImage = await Image.findOne({
          where: { eventId: id },
          transaction,
        });

        if (existingImage) {
          await deleteFile(existingImage.imageUrl);
          await existingImage.update(
            { imageUrl: newImageUrl },
            { transaction }
          );
        } else {
          await Image.create(
            { eventId: id, imageUrl: newImageUrl },
            { transaction }
          );
        }
      }
    });

    const updatedEvent = await Event.findByPk(id, {
      include: [{ model: Image, as: "image", attributes: ["imageUrl"] }],
    });

    const io = getSocketIO();
    io.emit("update_event", updatedEvent);

    return res
      .status(200)
      .json({ message: "Événement mis à jour", event: updatedEvent });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'événement :",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// ----------------------------------------------------------------------------
// 📌 Supprimer un événement et son image, puis émettre un événement Socket.IO
// ----------------------------------------------------------------------------
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const existingEvent = await Event.findByPk(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    await sequelize.transaction(async (transaction) => {
      const image = await Image.findOne({
        where: { eventId: id },
        transaction,
      });
      if (image) {
        await deleteFile(image.imageUrl);
        await image.destroy({ transaction });
      }
      await existingEvent.destroy({ transaction });
    });

    const io = getSocketIO();
    io.emit("delete_event", { id });

    return res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'événement :",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
