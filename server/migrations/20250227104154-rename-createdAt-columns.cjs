"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Events", "createdAt", "created_at");
    await queryInterface.renameColumn("Events", "updatedAt", "updated_at");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Events", "created_at", "createdAt");
    await queryInterface.renameColumn("Events", "updated_at", "updatedAt");
  },
};
