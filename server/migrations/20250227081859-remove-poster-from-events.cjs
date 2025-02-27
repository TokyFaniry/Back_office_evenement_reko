"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Events", "poster");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Events", "poster", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
