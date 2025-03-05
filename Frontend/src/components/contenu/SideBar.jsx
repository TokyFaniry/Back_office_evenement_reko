import "../../assets/CSS/SideBar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export function SideBar() {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary sidebar-container">
            <Link to="#" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none sectionLogo">
                
                <div className="fs-4"><img src={logo} className="logo"/></div>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="#" className="nav-link active" aria-current="page">
                        Evenements
                    </Link>
                </li>
                <li>
                    <Link to="#" className="nav-link link-body-emphasis">
                        
                        Billetterie
                    </Link>
                </li>
                <li>
                    <Link to="#" className="nav-link link-body-emphasis">
                        
                        Orders
                    </Link>
                </li>
                <li>
                    <Link to="#" className="nav-link link-body-emphasis">
                       
                        Products
                    </Link>
                </li>
                <li>
                    <Link to="#" className="nav-link link-body-emphasis">
                        
                        Customers
                    </Link>
                </li>
            </ul>
            <hr />
            <div className="dropdown">
                <Link
                    to="#"
                    className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                  
                    <strong>options</strong>
                </Link>
                <ul className="dropdown-menu text-small shadow ">
                    <li>
                        <Link className="dropdown-item" to="#">
                            New project...
                        </Link>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="#">
                            Settings
                        </Link>
                    </li>
                    <li>
                        <Link className="dropdown-item" to="#">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li>
                        <Link className="dropdown-item" to="#">
                            Sign out
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}