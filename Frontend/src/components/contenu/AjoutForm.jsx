import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import "../../assets/CSS/AjoutForm.css";

export function AjoutForm() {
  const [titre, setTitre] = useState("");
  const [typeEvenement, setTypeEvenement] = useState("Concert");
  const [autreType, setAutreType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [poster, setPoster] = useState(null);
  const [fileError, setFileError] = useState("");
  const [message, setMessage] = useState("");

  // Vérification du format de l'image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
      if (!validExtensions.includes(file.type)) {
        setFileError(
          "Seules les images au format PNG, JPEG ou JPG sont autorisées."
        );
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
      !description ||
      !location ||
      !totalSeats ||
      !poster ||
      (typeEvenement === "Autres" && !autreType)
    ) {
      setMessage("Tous les champs sont obligatoires");
      return;
    }

    // Création du FormData pour envoyer le fichier et les autres données
    const formData = new FormData();
    formData.append("title", titre);
    formData.append(
      "type",
      typeEvenement === "Autres" ? autreType : typeEvenement
    );
    formData.append("date", date);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("totalSeats", totalSeats);
    formData.append("poster", poster);

    try {
      const response = await axiosInstance.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMessage("Événement créé avec succès!");
        // Réinitialiser le formulaire
        setTitre("");
        setTypeEvenement("Concert");
        setAutreType("");
        setDate("");
        setDescription("");
        setLocation("");
        setTotalSeats("");
        setPoster(null);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur inconnue");
    }
  };

  return (
    <div className="ContenuAjoutForm">
      <h3>Ajouter un évènement</h3>
      <form onSubmit={handleSubmit} className="formulaires">
        <div className="mb-3">
          <label htmlFor="titreEvenement" className="form-label">
            Titre de l'évènement
          </label>
          <input
            type="text"
            className="form-control"
            id="titreEvenement"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="typeEvenement" className="form-label">
            Type
          </label>
          <select
            className="form-select"
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
          <div className="mb-3">
            <label htmlFor="autreType" className="form-label">
              Autre type
            </label>
            <input
              type="text"
              className="form-control"
              id="autreType"
              value={autreType}
              onChange={(e) => setAutreType(e.target.value)}
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="dateEvenement" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="dateEvenement"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descriptionEvenement" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="descriptionEvenement"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="locationEvenement" className="form-label">
            Lieu
          </label>
          <input
            type="text"
            className="form-control"
            id="locationEvenement"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="totalSeatsEvenement" className="form-label">
            Nombre de places
          </label>
          <input
            type="number"
            className="form-control"
            id="totalSeatsEvenement"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="afficheEvenement" className="form-label">
            Affiche de l'évènement
          </label>
          <input
            type="file"
            className="form-control"
            id="afficheEvenement"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
          {fileError && <p className="text-danger">{fileError}</p>}
        </div>
        <div className="mb-3 enr">
          <button className="btn btn-primary enrbtn" type="submit">
            Enregistrer
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
