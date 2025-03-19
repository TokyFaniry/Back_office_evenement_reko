import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import validator from "validator";

const Image = sequelize.define(
  "Image",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
      references: {
        model: "Events", // doit correspondre à la table Events
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url",
      validate: {
        isValidUrl(value) {
          if (value.includes("localhost") || value.includes("127.0.0.1")) {
            if (!value.startsWith("http://") && !value.startsWith("https://")) {
              throw new Error("L'URL de l'image doit être valide");
            }
            return;
          }
          if (
            !validator.isURL(value, {
              require_protocol: true,
              protocols: ["http", "https"],
            })
          ) {
            throw new Error("L'URL de l'image doit être valide");
          }
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Images",
    freezeTableName: true,
    hooks: {
      beforeCreate: (img) => {
        if (img.imageUrl) img.imageUrl = img.imageUrl.trim();
      },
      beforeUpdate: (img) => {
        if (img.imageUrl) img.imageUrl = img.imageUrl.trim();
      },
    },
  }
);

Image.associate = (models) => {
  Image.belongsTo(models.Event, {
    foreignKey: "event_id",
    as: "event",
  });
};

export default Image;
