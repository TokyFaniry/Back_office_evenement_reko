import "../../assets/CSS/AjoutForm.css";

export function AjoutForm() {
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
          <select className="form-select" id="typeEvenement">
            <option selected>Concert</option>
            <option value="1">Cabaret</option>
            <option value="2">Autres</option>
          </select>
        </div>

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
          <input type="file" className="form-control" id="afficheEvenement" />
        </div>
      </div>

        <div class="mb-3 enr ">
            <button class="btn btn-primary enrbtn " type="submit">Enregistrer</button>
        </div>

    </div>
  );
}
