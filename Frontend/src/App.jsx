// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { AjoutEvents } from "./components/AjoutEvents.jsx";
import EventManagement from "./components/contenu/EventManagement.jsx";
import SideBar from "./components/contenu/SideBar.jsx";
import Navbar from "./components/contenu/navbar.jsx";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Router>
      <Navbar />
      <SideBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="events/:id" element={<EventManagement />} />
        <Route path="/ajoutEvents" element={<AjoutEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
