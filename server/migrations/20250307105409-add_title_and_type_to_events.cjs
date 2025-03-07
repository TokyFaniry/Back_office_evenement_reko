"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Events", "title", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn("Events", "type", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Events", "title"),
      queryInterface.removeColumn("Events", "type"),
    ]);
  },
};
