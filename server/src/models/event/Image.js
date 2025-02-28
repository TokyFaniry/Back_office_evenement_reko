import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Event from "./Event.js";

const Image = sequelize.define(
  "Image",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id", // Correspondance correcte avec la colonne
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url",
    },
  },
  {
    tableName: "images",
    timestamps: true,
    freezeTableName: true,
    createdAt: "created_at", // Correspond à la colonne renommée
    updatedAt: "updated_at",
  }
);
Image.associate = (models) => {
  Image.belongsTo(models.Event, {
    foreignKey: "eventId",
    as: "event",
  });
};
export default Image;
