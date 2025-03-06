import { Link } from "react-router-dom";
import "../../assets/CSS/ContenuAccueil.css";
import { Plus } from "lucide-react";


export default function ContenuAccueil() {
    return (
        <div className="contenuAccueil container">
            <Link to="/ajoutEvents" className="ajoutConcert col-md-3 col-sm-6 col-12">
                <div className="ContenuAjoutConcert">
                    <div className="iconContainer">
                        <Plus size={35} color="white" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
