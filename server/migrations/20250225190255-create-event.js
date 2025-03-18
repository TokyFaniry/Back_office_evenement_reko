"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Events", {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    heure: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    total_seats: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    etat_de_billets: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "disponible",
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
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.removeConstraint(
        "tickets",
        "tickets_event_id_fkey",
        {
          transaction,
        }
      );
      console.log(
        "✅ Contrainte 'tickets_event_id_fkey' supprimée avec succès"
      );
    } catch (error) {
      console.log(
        "⚠️ Erreur lors de la suppression de la contrainte 'tickets_event_id_fkey':",
        error.message
      );
    }
    await queryInterface.dropTable("Events", { transaction });
    console.log("🗑️ Table 'Events' supprimée avec succès");
  });
}
