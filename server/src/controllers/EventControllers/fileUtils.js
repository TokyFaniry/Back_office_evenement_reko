// src/controllers/EventControllers/fileUtils.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remonter de trois niveaux pour atteindre la racine "server"
// puis accéder à "public/uploads/events"
const UPLOAD_PATH = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "public",
  "uploads",
  "events"
);

// Création du dossier d'uploads s'il n'existe pas
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

/**
 * Supprime un fichier à partir du nom fourni.
 * Utilise path.basename pour s'assurer que seul le nom du fichier est utilisé.
 */
const deleteFile = async (filename) => {
  try {
    const filePath = path.join(UPLOAD_PATH, path.basename(filename));
    await fs.promises.access(filePath);
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Erreur lors de la suppression du fichier: ${error.message}`);
  }
};

export { deleteFile, UPLOAD_PATH };
