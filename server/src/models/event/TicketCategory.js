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
      set(value) {
        this.setDataValue("name", value.trim());
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "TicketCategories",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // Contraintes uniques composées sur event_id et name
    indexes: [
      {
        unique: true,
        fields: ["event_id", "name"],
      },
    ],
  }
);

TicketCategory.associate = (models) => {
  TicketCategory.hasMany(models.Ticket, {
    foreignKey: "category_id",
    as: "tickets",
    onDelete: "CASCADE",
  });
};

export default TicketCategory;
