import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TicketCategory = sequelize.define(
  "TicketCategory",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "event_category",
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
  }
);

export default TicketCategory;
