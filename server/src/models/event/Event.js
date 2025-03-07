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
      field: "total_seats",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le titre est obligatoire",
        },
        len: {
          args: [5, 255],
          msg: "Le titre doit contenir entre 5 et 255 caractères",
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le type est obligatoire",
        },
        isIn: {
          args: [["Autres", "Cabaret", "Concert"]],
          msg: "Le type doit être l'un des suivants : Autres, Cabaret, Concert",
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Events",
  }
);

Event.associate = (models) => {
  Event.hasOne(models.Image, {
    foreignKey: "event_id",
    as: "image",
    onDelete: "CASCADE",
  });
  Event.hasMany(models.Ticket, {
    foreignKey: "event_id",
    as: "tickets",
  });
  Event.hasMany(models.TicketCategory, {
    foreignKey: "event_id",
    as: "ticketCategories",
    onDelete: "CASCADE",
  });
};

export default Event;
