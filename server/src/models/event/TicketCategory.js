import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TicketCategory = sequelize.define(
  "TicketCategory",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
      validate: { isInt: true },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "event_category", // Contrainte d'unicité sur la combinaison event / name
      validate: { notEmpty: true },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "TicketCategories",
    hooks: {
      beforeCreate: (category) => {
        category.name = category.name.trim();
      },
      beforeUpdate: (category) => {
        category.name = category.name.trim();
      },
    },
  }
);

export default TicketCategory;
