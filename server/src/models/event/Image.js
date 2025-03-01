import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Image = sequelize.define(
  "Image",
  {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "event_id",
      references: {
        model: "Events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url", // en snake_case
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Images",
  }
);

Image.associate = (models) => {
  Image.belongsTo(models.Event, {
    foreignKey: "event_id",
    as: "event",
  });
};

export default Image;
