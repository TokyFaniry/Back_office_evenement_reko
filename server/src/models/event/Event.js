import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Event = sequelize.define(
  "Event",
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isFutureDate(value) {
          if (new Date(value) <= new Date()) {
            throw new Error("La date doit être dans le futur");
          }
        },
      },
    },
    heure: {
      type: DataTypes.TIME,
      allowNull: false,
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    etatDeBillets: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "disponible",
      field: "etat_de_billets",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Events",
    freezeTableName: true,
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
