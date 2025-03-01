import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Ticket = sequelize.define(
  "Ticket",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
      references: {
        model: "Events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
      references: {
        model: "TicketCategories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placement: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Libre",
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticket_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    scanned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Ticket.associate = (models) => {
  Ticket.belongsTo(models.Event, {
    foreignKey: "event_id",
    as: "event",
  });
  Ticket.belongsTo(models.TicketCategory, {
    foreignKey: "category_id",
    as: "category",
  });
};

export default Ticket;
