"use strict";

// migrations/xxxx-fix-event-timestamps.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn("Images", "createdAt", "created_at");
    await queryInterface.renameColumn("Images", "updatedAt", "updated_at");
  },
  down: async (queryInterface) => {
    await queryInterface.renameColumn("Images", "created_at", "createdAt");
    await queryInterface.renameColumn("Images", "updated_at", "updatedAt");
  },
};
