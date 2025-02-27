import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Image = sequelize.define(
  "Image",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "eventId",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "imageUrl",
    },
  },
  {
    timestamps: true,
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
