import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import "../../assets/CSS/AjoutForm.css";
import { message } from "antd";

export function AjoutForm({ onEventAdded }) {
  const [titre, setTitre] = useState("");
  const [typeEvenement, setTypeEvenement] = useState("Concert");
  const [autreType, setAutreType] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState(""); // Ajout de l'heure
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [poster, setPoster] = useState(null);
  const [fileError, setFileError] = useState("");

  // Vérification du format de l'image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
      if (!validExtensions.includes(file.type)) {
        setFileError("Seules les images PNG, JPEG ou JPG sont autorisées.");
        e.target.value = "";
      } else {
        setFileError("");
        setPoster(file);
      }
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !titre ||
      !date ||
      !heure || // Vérification de l'heure
      !description ||
      !location ||
      !totalSeats ||
      !poster ||
      (typeEvenement === "Autres" && !autreType)
    ) {
      message.error("Tous les champs sont obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("title", titre);
    formData.append(
      "type",
      typeEvenement === "Autres" ? autreType : typeEvenement
    );
    formData.append("date", date);
    formData.append("heure", heure); // Ajout de l'heure
    formData.append("description", description);
    formData.append("location", location);
    formData.append("totalSeats", totalSeats);
    formData.append("poster", poster);

    // Affichage du message de chargement
    const hideLoading = message.loading("Enregistrement en cours...", 0);

    try {
      const response = await axiosInstance.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      hideLoading(); // Cache le message de chargement

      if (response.data.success) {
        message.success("Événement créé avec succès!");
        if (onEventAdded) {
          onEventAdded(response.data.event);
        }

        // Réinitialisation du formulaire
        setTitre("");
        setTypeEvenement("Concert");
        setAutreType("");
        setDate("");
        setHeure(""); // Réinitialisation de l'heure
        setDescription("");
        setLocation("");
        setTotalSeats("");
        setPoster(null);
      }
    } catch (error) {
      hideLoading();
      message.error(
        error.response?.data?.message || "Erreur inconnue lors de la création"
      );
    }
  };

  return (
    <div className="page-wrapper">
      <div className="ajout-container">
        <h3>Ajouter un évènement</h3>
        <form onSubmit={handleSubmit} className="formulaire">
          <div className="form-group">
            <label htmlFor="titreEvenement">Titre de l'évènement</label>
            <input
              type="text"
              id="titreEvenement"
              placeholder="Entrez le titre de l'évènement"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="typeEvenement">Type</label>
            <select
              id="typeEvenement"
              value={typeEvenement}
              onChange={(e) => setTypeEvenement(e.target.value)}
            >
              <option value="Concert">Concert</option>
              <option value="Cabaret">Cabaret</option>
              <option value="Autres">Autres</option>
            </select>
          </div>
          {typeEvenement === "Autres" && (
            <div className="form-group">
              <label htmlFor="autreType">Autre type</label>
              <input
                type="text"
                id="autreType"
                placeholder="Précisez le type"
                value={autreType}
                onChange={(e) => setAutreType(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="dateEvenement">Date</label>
            <input
              type="date"
              id="dateEvenement"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="heureEvenement">Heure</label>
            <input
              type="time"
              id="heureEvenement"
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionEvenement">Description</label>
            <textarea
              id="descriptionEvenement"
              placeholder="Décrivez l'évènement"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="locationEvenement">Lieu</label>
            <input
              type="text"
              id="locationEvenement"
              placeholder="Entrez le lieu de l'évènement"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalSeatsEvenement">Nombre de places</label>
            <input
              type="number"
              id="totalSeatsEvenement"
              placeholder="Nombre total de places"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="afficheEvenement">Affiche de l'évènement</label>
            <input
              type="file"
              id="afficheEvenement"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
            {fileError && <p className="error">{fileError}</p>}
          </div>
          <div className="form-group submit-group">
            <button type="submit" className="submit-btn">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
