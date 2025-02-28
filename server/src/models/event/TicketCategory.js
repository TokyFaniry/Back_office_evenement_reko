import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Event from "./Event.js";

const TicketCategory = sequelize.define(
  "TicketCategory",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
      references: {
        // Ajoutez la référence manquante
        model: "Events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "La quantité doit être au moins 1",
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // Ajoutez ces lignes
    updatedAt: "updated_at",
    freezeTableName: true,
    tableName: "TicketCategories",
  }
);

export default TicketCategory;
