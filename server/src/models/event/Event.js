import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Event = sequelize.define(
  "Event",
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: new Date().toISOString(),
          msg: "La date doit être dans le futur",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [20, 2000],
          msg: "La description doit contenir entre 20 et 2000 caractères",
        },
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La localisation est obligatoire",
        },
      },
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "Le nombre de places doit être au moins 1",
        },
      },
      field: "totalSeats",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // Correspond à la colonne renommée
    updatedAt: "updated_at", // Force Sequelize à utiliser snake_case dans la DB
  }
);

Event.associate = (models) => {
  Event.hasOne(models.Image, {
    foreignKey: "eventId",
    as: "image",
    onDelete: "CASCADE",
  });
  Event.hasMany(models.Ticket, {
    foreignKey: "eventId",
    as: "tickets",
  });
};

export default Event;
