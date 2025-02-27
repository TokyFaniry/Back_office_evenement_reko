import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Ticket = sequelize.define(
  "Ticket",
  {
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
    scanned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isWithinQuantity(value) {
          if (value > this.quantity) {
            throw new Error("Le nombre de scans ne peut dépasser la quantité");
          }
        },
      },
    },
  },
  {
    timestamps: true,
    indexes: [{ fields: ["eventId"] }, { fields: ["categoryId"] }],
  }
);

export default Ticket;
