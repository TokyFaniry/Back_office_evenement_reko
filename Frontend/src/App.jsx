import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { AjoutEvents } from "./components/AjoutEvents.jsx";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



function App() {
    return (
        <Router>
           <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/ajoutEvents" element={<AjoutEvents/>} />
           </Routes> 
        </Router>
    );
}

export default App;