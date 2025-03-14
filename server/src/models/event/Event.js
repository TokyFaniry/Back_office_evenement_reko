import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Event = sequelize.define(
  "Event",
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        // Validation personnalisée garantissant que la date soit future
        isFutureDate(value) {
          if (new Date(value) <= new Date()) {
            throw new Error("La date doit être dans le futur");
          }
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
          args: [1],
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
      type: DataTypes.STRING, // On conserve le type comme STRING
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Events",
    hooks: {
      beforeCreate: (event) => {
        if (event.title) event.title = event.title.trim();
        if (event.description) event.description = event.description.trim();
        if (event.location) event.location = event.location.trim();
        if (event.type) event.type = event.type.trim();
      },
      beforeUpdate: (event) => {
        if (event.title) event.title = event.title.trim();
        if (event.description) event.description = event.description.trim();
        if (event.location) event.location = event.location.trim();
        if (event.type) event.type = event.type.trim();
      },
    },
  }
);

// Associations définies dans l'index ou lors de l'initialisation globale des modèles
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
