// src/components/AjoutForm/AjoutForm.jsx
import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import "../../assets/CSS/AjoutForm.css";

export function AjoutForm() {
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

    if (!date || !description || !location || !totalSeats || !poster) {
      setMessage("Tous les champs sont obligatoires");
      return;
    }

    // Création du FormData pour envoyer le fichier et les autres données
    const formData = new FormData();
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
