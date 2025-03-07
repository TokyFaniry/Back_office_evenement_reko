import { useState } from "react";
import "../../assets/CSS/AjoutForm.css";

export function AjoutForm() {
  const [typeEvenement, setTypeEvenement] = useState("Concert");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
      if (!validExtensions.includes(file.type)) {
        setFileError("Seules les images au format PNG, JPEG ou JPG sont autorisées.");
        e.target.value = ""; // Réinitialiser l'input file
      } else {
        setFileError("");
      }
    }
  };

  return (
    <div className="ContenuAjoutForm">
      <h3>Ajouter un évènement</h3>

      <div className="formulaires">
        <div className="mb-3">
          <label htmlFor="titreEvenement" className="form-label">
            Titre de l'évènement
          </label>
          <input type="text" className="form-control" id="titreEvenement" />
        </div>

        <div className="mb-3">
          <label htmlFor="typeEvenement" className="form-label">Type</label>
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
            <label htmlFor="autreType" className="form-label">Autre type</label>
            <input type="text" className="form-control" id="autreType" />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="dateEvenement" className="form-label">Date</label>
          <input type="date" className="form-control" id="dateEvenement" />
        </div>

        <div className="mb-3">
          <label htmlFor="descriptionEvenement" className="form-label">
            Description
          </label>
          <textarea className="form-control" id="descriptionEvenement" rows="3"></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="afficheEvenement" className="form-label">Affiche de l'évènement</label>
          <input 
            type="file" 
            className="form-control" 
            id="afficheEvenement" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleFileChange} 
          />
          {fileError && <p className="text-danger">{fileError}</p>}
        </div>
      </div>

      <div className="mb-3 enr">
        <button className="btn btn-primary enrbtn" type="submit">
          Enregistrer
        </button>
      </div>
    </div>
  );
}
