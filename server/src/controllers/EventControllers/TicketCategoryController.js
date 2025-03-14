// src/controllers/EventControllers/TicketCategoryControllers.js
import db from "../../models/event/index.js";

const { Event, TicketCategory } = db;

/**
 * Créer une catégorie de ticket pour un événement.
 */
export const createTicketCategory = async (req, res) => {
  const { eventId, name, quantity, price } = req.body;

  if (!eventId || !name || !quantity || !price) {
    return res.status(400).json({
      message: "Les champs eventId, name, quantity et price sont obligatoires",
    });
  }

  try {
    // Vérifie que l'évènement existe
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Crée la catégorie de ticket
    const newCategory = await TicketCategory.create({
      eventId,
      name,
      quantity,
      price,
    });

    res
      .status(201)
      .json({ message: "Catégorie créée avec succès", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Récupérer toutes les catégories de ticket pour un événement donné.
 */
export const getTicketCategoriesByEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const categories = await TicketCategory.findAll({ where: { eventId } });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Mettre à jour une catégorie de ticket.
 */
export const updateTicketCategory = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;

  try {
    const category = await TicketCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await category.update({ name, quantity, price });
    res.status(200).json({ message: "Catégorie mise à jour", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Supprimer une catégorie de ticket.
 */
export const deleteTicketCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await TicketCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await category.destroy();
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
