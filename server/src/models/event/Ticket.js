import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Ticket = sequelize.define(
  "Ticket",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
      validate: { isInt: true },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
      validate: { isInt: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { is: /^\+?[1-9]\d{1,14}$/ },
    },
    placement: {
      type: DataTypes.STRING,
      defaultValue: "Libre",
    },
    serial_number: {
      type: DataTypes.STRING(16),
      unique: true,
      validate: { len: [12, 16] },
    },
    ticket_code: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    scanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { unique: true, fields: ["serial_number"] },
      { unique: true, fields: ["ticket_code"] },
      { fields: ["event_id"] },
      { fields: ["category_id"] },
    ],
  }
);

export default Ticket;
