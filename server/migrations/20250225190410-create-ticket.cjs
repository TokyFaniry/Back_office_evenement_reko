"use strict";

module.exports = {
  up: async (context) => {
    const { queryInterface, Sequelize } = context; // Récupère queryInterface et Sequelize
    await queryInterface.createTable("Tickets", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Events",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TicketCategories",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telephone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      placement: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Libre",
      },
      serial_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ticket_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // L'unicité crée automatiquement un index unique
      },
      scanned: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (context) => {
    const { queryInterface } = context;
    await queryInterface.dropTable("Tickets");
  },
};
