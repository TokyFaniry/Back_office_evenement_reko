import sequelize from "../../config/database.js";
import Event from "./Event.js";
import Ticket from "./Ticket.js";
import TicketCategory from "./TicketCategory.js";
import Image from "./Image.js";

const db = {
  sequelize,
  Event,
  Ticket,
  TicketCategory,
  Image,
};

// Associations
db.Event.hasMany(db.Ticket, {
  foreignKey: "event_id",
  as: "tickets",
  onDelete: "CASCADE",
});
db.Ticket.belongsTo(db.Event, {
  foreignKey: "event_id",
  as: "event",
});
db.Event.hasMany(db.TicketCategory, {
  foreignKey: "event_id",
  as: "ticketCategories",
  onDelete: "CASCADE",
});
db.TicketCategory.belongsTo(db.Event, {
  foreignKey: "event_id",
  as: "event",
});
db.TicketCategory.hasMany(db.Ticket, {
  foreignKey: "category_id",
  as: "tickets",
  onDelete: "CASCADE",
});
db.Ticket.belongsTo(db.TicketCategory, {
  foreignKey: "category_id",
  as: "category",
});
db.Event.hasOne(db.Image, {
  foreignKey: "event_id",
  as: "image",
  onDelete: "CASCADE",
});
db.Image.belongsTo(db.Event, {
  foreignKey: "event_id",
  as: "event",
});

export default db;
