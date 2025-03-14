import sequelize from "../../config/database.js";

import Event from "./Event.js";
import Ticket from "./Ticket.js";
import TicketCategory from "./TicketCategory.js";
import Image from "./Image.js";

// Regroupement des modèles dans un objet central
const db = {
  sequelize,
  Event,
  Ticket,
  TicketCategory,
  Image,
};

// Définition des associations

// Un Event peut accueillir de nombreux Tickets
db.Event.hasMany(db.Ticket, {
  foreignKey: "event_id",
  as: "tickets",
  onDelete: "CASCADE",
});

// Un Ticket appartient à un Event
db.Ticket.belongsTo(db.Event, {
  foreignKey: "event_id",
  as: "event",
});

// Un Event peut avoir plusieurs catégories de Tickets
db.Event.hasMany(db.TicketCategory, {
  foreignKey: "event_id",
  as: "ticketCategories",
  onDelete: "CASCADE",
});

// Une catégorie de Ticket appartient à un Event
db.TicketCategory.belongsTo(db.Event, {
  foreignKey: "event_id",
  as: "event",
});

// Une catégorie de Ticket peut avoir plusieurs Tickets
db.TicketCategory.hasMany(db.Ticket, {
  foreignKey: "category_id",
  as: "tickets",
  onDelete: "CASCADE",
});

// Un Ticket appartient à une catégorie de Ticket
db.Ticket.belongsTo(db.TicketCategory, {
  foreignKey: "category_id",
  as: "category",
});

// Un Event peut avoir une image principale
db.Event.hasOne(db.Image, {
  foreignKey: "event_id",
  as: "image",
  onDelete: "CASCADE",
});

// Une Image appartient à un Event
db.Image.belongsTo(db.Event, {
  foreignKey: "event_id",
  as: "event",
});

export default db;
