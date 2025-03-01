import sequelize from "../../config/database.js";
import Event from "./Event.js";
import Ticket from "./Ticket.js";
import TicketCategory from "./TicketCategory.js";
import Image from "./Image.js";

// Associations
Event.hasMany(Ticket, {
  foreignKey: "event_id",
  as: "tickets",
  onDelete: "CASCADE",
});
Ticket.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

Event.hasMany(TicketCategory, {
  foreignKey: "event_id",
  as: "ticketCategories",
  onDelete: "CASCADE",
});
TicketCategory.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

TicketCategory.hasMany(Ticket, {
  foreignKey: "category_id",
  as: "tickets",
  onDelete: "CASCADE",
});
Ticket.belongsTo(TicketCategory, {
  foreignKey: "category_id",
  as: "category",
});

Event.hasOne(Image, {
  foreignKey: "event_id",
  as: "image",
  onDelete: "CASCADE",
});
Image.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

const db = {
  sequelize,
  Event,
  Ticket,
  TicketCategory,
  Image,
};

export default db;
