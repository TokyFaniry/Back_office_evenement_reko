import fs from "fs";
import path from "path";
import db from "../../models/event/index.js";
import sequelize from "../../config/database.js";

const { Event, Image, Ticket, TicketCategory } = db;

// Définir le chemin d'upload
const UPLOAD_PATH = path.join("public", "uploads", "events");

// Vérifier si le dossier existe
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Supprimer un fichier en toute sécurité
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Erreur suppression fichier ${filePath}:`, err);
    }
  }
};

// 📌 Créer un événement avec une image
export const createEvent = async (req, res) => {
  const { date, description, location, totalSeats } = req.body;

  if (!req.file || !date || !description || !location || !totalSeats) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires" });
  }

  const imageUrl = path.join(UPLOAD_PATH, req.file.filename);
  const transaction = await sequelize.transaction();
  try {
    const newEvent = await Event.create(
      { date, description, location, totalSeats },
      { transaction }
    );

    await Image.create({ eventId: newEvent.id, imageUrl }, { transaction });

    await transaction.commit();
    res
      .status(201)
      .json({ message: "Événement créé avec succès", event: newEvent });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 📌 Obtenir tous les événements
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

// 📌 Obtenir un événement par ID
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: [
        { model: Image, as: "image", attributes: ["imageUrl"] },
        {
          model: Ticket,
          as: "tickets", // Utilisez l'alias défini dans l'association Event.hasMany(Ticket, { as: "tickets", ... })
          include: [
            {
              model: TicketCategory,
              as: "category", // Utilisez l'alias défini dans Ticket.belongsTo(TicketCategory, { as: "category", ... })
              attributes: ["name"],
            },
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

// 📌 Mettre à jour un événement avec image
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { date, description, location, totalSeats } = req.body;
  const newImageUrl = req.file
    ? path.join(UPLOAD_PATH, req.file.filename)
    : null;

  const transaction = await sequelize.transaction();
  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      await transaction.rollback();
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
        deleteFile(existingImage.imageUrl);
        await existingImage.update({ imageUrl: newImageUrl }, { transaction });
      } else {
        await Image.create(
          { eventId: id, imageUrl: newImageUrl },
          { transaction }
        );
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Événement mis à jour", event });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 📌 Supprimer un événement et son image
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    const image = await Image.findOne({ where: { eventId: id }, transaction });
    if (image) {
      deleteFile(image.imageUrl);
      await image.destroy({ transaction });
    }

    await event.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
