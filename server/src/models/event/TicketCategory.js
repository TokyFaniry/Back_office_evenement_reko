import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

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
    freezeTableName: true, // Empêche Sequelize de modifier le nom de la table
    tableName: "TicketCategories", // Nom exact de la table tel que créé dans la migration
  }
);

export default TicketCategory;
