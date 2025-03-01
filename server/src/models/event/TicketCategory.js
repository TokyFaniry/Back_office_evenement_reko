import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TicketCategory = sequelize.define(
  "TicketCategory",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: true,
    tableName: "TicketCategories",
  }
);

TicketCategory.associate = (models) => {
  TicketCategory.belongsTo(models.Event, {
    foreignKey: "event_id",
    as: "event",
  });
  TicketCategory.hasMany(models.Ticket, {
    foreignKey: "category_id",
    as: "tickets",
    onDelete: "CASCADE",
  });
};

export default TicketCategory;
