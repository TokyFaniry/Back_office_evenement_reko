import axios from "axios";
import db from "../../models/event/index.js";
import crypto from "crypto";

const { Ticket, TicketCategory, sequelize } = db;

const QUANTUM_API_URL = "https://qrng.anu.edu.au/API/jsonI.php";
const SERIAL_RETRY_LIMIT = 10;

// Ensemble pour stocker temporairement les numéros de série générés
const generatedSerials = new Set();

// Fonction pour obtenir un nombre aléatoire quantique via l'API
async function getQuantumNumbers(length = 2) {
  try {
    const response = await axios.get(
      `${QUANTUM_API_URL}?length=${length}&type=uint8`,
      { timeout: 3000 }
    );
    // On s'assure de retourner des nombres (ici des valeurs numériques)
    return response.data?.data || [];
  } catch {
    // En cas d'échec, on utilise crypto.randomBytes et on convertit en tableau de nombres
    return Array.from(crypto.randomBytes(length));
  }
}

// Fonction pour générer un numéro de série unique
async function generateSerialNumber() {
  const [q1, q2] = await getQuantumNumbers(2);
  return [
    q1.toString().padStart(3, "0"),
    String.fromCharCode(65 + (q1 % 26)),
    q2.toString().padStart(3, "0"),
    String.fromCharCode(97 + (q2 % 26)),
    crypto.randomInt(1000, 9999),
  ].join("");
}

async function generateUniqueSerialNumber() {
  for (let i = 0; i < SERIAL_RETRY_LIMIT; i++) {
    const serial = await generateSerialNumber();
    const exists = await Ticket.findOne({ where: { serial_number: serial } });
    if (!exists) return serial;
  }
  throw new Error("Serial generation failed");
}

// Contrôleur pour créer un ticket
export const createTicket = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // On attend que les champs eventId, categoryId, email, telephone soient fournis
    const { eventId, categoryId } = req.body;
    // Vérifier la catégorie et s'assurer qu'il reste des tickets disponibles
    const category = await TicketCategory.findByPk(categoryId, {
      lock: true,
      transaction,
    });

    if (!category || category.quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({ error: "Category unavailable" });
    }

    // Génération du numéro de série unique
    const serialNumber = await generateUniqueSerialNumber();
    // Création d'un ticket_code (ici, une valeur simple basée sur le timestamp)
    const ticketCode = `TCK-${Date.now()}`;

    // Création du ticket dans la base de données
    const newTicket = await Ticket.create(
      {
        ...req.body,
        serial_number: serialNumber,
        ticket_code: ticketCode,
      },
      { transaction }
    );

    // Décrémentez la quantité disponible dans la catégorie
    await category.decrement("quantity", { by: 1, transaction });
    await transaction.commit();

    res.status(201).json({
      id: newTicket.id,
      serial_number: newTicket.serial_number,
      ticket_code: newTicket.ticket_code,
    });
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

// Contrôleur pour récupérer tous les tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Contrôleur pour récupérer un ticket par son ID
export const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Contrôleur pour mettre à jour un ticket (pour modifier email, telephone ou placement)
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { email, telephone, placement } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }
    await ticket.update({ email, telephone, placement });
    res.status(200).json({ message: "Ticket mis à jour", ticket });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Contrôleur pour supprimer un ticket
export const deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }
    await ticket.destroy();
    res.status(200).json({ message: "Ticket supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

function handleError(res, error) {
  const status = error.name === "SequelizeUniqueConstraintError" ? 409 : 500;
  res.status(status).json({
    error: error.message,
    details: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}
