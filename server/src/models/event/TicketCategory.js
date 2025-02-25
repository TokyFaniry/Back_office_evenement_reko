import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TicketCategory = sequelize.define(
  "TicketCategory",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default TicketCategory;
