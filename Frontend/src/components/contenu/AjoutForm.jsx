import "../../assets/CSS/AjoutForm.css";


export function AjoutForm(){

    return(
    <div className="ContenuAjoutForm">
        <h3>Ajouter un évènement</h3>

        <div className="formulaires">
            <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Titre de l'évènement</label>
                <input type="email" className="form-control"  />
            </div>
            <label>Type</label>
            <select className="form-select" aria-label="Default select example">
                <option selected>Concert</option>
                <option value="1">Cabaret</option>
                <option value="2">Autres</option>
            </select>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
        </div>
    </div>
    );
}