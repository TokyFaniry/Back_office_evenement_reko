import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { AjoutEvents } from "./components/AjoutEvents.jsx";
import EventManagement from "./components/contenu/EventManagement.jsx";
import SideBar from "./components/contenu/SideBar.jsx";
import Navbar from "./components/contenu/navbar.jsx";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Navbar toggleSidebar={toggleSidebar} />
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`transition-all duration-300 pt-16 p-4 bg-gray-100 min-h-screen ${
          isSidebarOpen ? "ml-64" : "ml-0 lg:ml-64"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="events/:id" element={<EventManagement />} />
          <Route path="/ajoutEvents" element={<AjoutEvents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
