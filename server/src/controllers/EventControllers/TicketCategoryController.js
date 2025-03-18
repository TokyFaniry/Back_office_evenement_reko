import db from "../../models/event/index.js";

const { Event, TicketCategory } = db;

/**
 * Créer une catégorie de ticket pour un événement.
 */
export const createTicketCategory = async (req, res) => {
  const { eventId, name, quantity, price } = req.body;

  if (!eventId || !name?.trim() || quantity == null || price == null) {
    return res.status(400).json({
      message: "Tous les champs (eventId, name, quantity, price) sont requis",
    });
  }

  try {
    // Vérification existence de l'événement
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable" });
    }

    // Normalisation du nom
    const normalizedName = name.trim().toLowerCase();

    // Vérification existence de la catégorie
    const existingCategory = await TicketCategory.findOne({
      where: {
        eventId,
        name: normalizedName,
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: `Une catégorie "${normalizedName}" existe déjà pour cet événement`,
      });
    }

    const newCategory = await TicketCategory.create({
      eventId,
      name: normalizedName,
      quantity,
      price,
    });

    res.status(201).json({
      message: "Catégorie créée avec succès",
      category: newCategory,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Une catégorie avec ce nom existe déjà pour cet événement",
      });
    }
    console.error("Erreur création catégorie:", error);
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
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    // Vérification unicité si modification du nom
    if (name && name.trim().toLowerCase() !== category.name) {
      const normalizedName = name.trim().toLowerCase();
      const existing = await TicketCategory.findOne({
        where: {
          eventId: category.eventId,
          name: normalizedName,
          id: { [Sequelize.Op.ne]: id },
        },
      });

      if (existing) {
        return res.status(409).json({
          message: `Une catégorie "${normalizedName}" existe déjà pour cet événement`,
        });
      }
    }

    const updates = {};
    if (name) updates.name = name.trim().toLowerCase();
    if (quantity !== undefined) updates.quantity = quantity;
    if (price !== undefined) updates.price = price;

    await category.update(updates);

    res.status(200).json({
      message: "Catégorie mise à jour",
      category: await TicketCategory.findByPk(id),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Une catégorie avec ce nom existe déjà pour cet événement",
      });
    }
    console.error("Erreur mise à jour catégorie:", error);
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
