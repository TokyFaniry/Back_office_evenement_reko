import sequelize from "../../config/database.js";
import Event from "./Event.js";
import Ticket from "./Ticket.js";
import TicketCategory from "./TicketCategory.js";
import Image from "./Image.js";

// Un événement a plusieurs tickets
Event.hasMany(Ticket, {
  foreignKey: "eventId",
  as: "tickets",
  onDelete: "CASCADE",
});

// Un ticket appartient à un événement
Ticket.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
});

// Une catégorie de ticket a plusieurs tickets
TicketCategory.hasMany(Ticket, {
  foreignKey: "categoryId",
  as: "tickets",
  onDelete: "CASCADE",
});

// Un ticket appartient à une catégorie
Ticket.belongsTo(TicketCategory, {
  foreignKey: "categoryId",
  as: "category",
});

// Un événement a plusieurs catégories de tickets
Event.hasMany(TicketCategory, {
  foreignKey: "eventId",
  as: "ticketCategories",
  onDelete: "CASCADE",
});

// Une catégorie de ticket appartient à un événement
TicketCategory.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
});

// Un événement a une image
Event.hasOne(Image, {
  foreignKey: "eventId",
  as: "image",
  onDelete: "CASCADE",
});
Image.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
});

// Exportation des modèles et de l'instance Sequelize
const db = {
  sequelize,
  Event,
  Ticket,
  TicketCategory,
  Image,
};

export default db;
