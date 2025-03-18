"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("TicketCategories", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
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
    // Récupérer la liste des tables existantes dans la transaction
    const tables = await queryInterface.showAllTables({ transaction });
    // Normaliser les noms pour comparaison (en minuscules)
    const tableNames = tables.map((t) => t.toLowerCase());

    if (tableNames.includes("tickets")) {
      try {
        await queryInterface.removeConstraint(
          "tickets",
          "tickets_category_id_fkey",
          { transaction }
        );
        console.log(
          "✅ Contrainte 'tickets_category_id_fkey' supprimée avec succès"
        );
      } catch (error) {
        console.log(
          "⚠️ Erreur lors de la suppression de la contrainte 'tickets_category_id_fkey':",
          error.message
        );
      }
    } else {
      console.log(
        "⚠️ La table 'tickets' n'existe pas : suppression de la contrainte ignorée"
      );
    }

    // Supprimer la table TicketCategories avec cascade (si d'autres objets en dépendent)
    await queryInterface.dropTable("TicketCategories", {
      transaction,
      cascade: true,
    });
    console.log("🗑️ Table 'TicketCategories' supprimée avec succès");
  });
}
