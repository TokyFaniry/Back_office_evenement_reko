import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Ticket = sequelize.define(
  "Ticket",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id", // passage en snake_case
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
    },
    scanned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      // Suppression de la validation asynchrone
    },
  },
  {
    tableName: "tickets",
    timestamps: true,
    freezeTableName: true,
  }
);

export default Ticket;
