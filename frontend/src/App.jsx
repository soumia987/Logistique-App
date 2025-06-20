import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Annonces from "./pages/Annonces";
import Footer from "./components/Footer"; // Assure-toi du bon chemin

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Annonces" element={<Annonces />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
