import { Link, Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import React from "react";
import "./App.css";

function App() {
  return (
    <div>
      <BroswerRoter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/meal" element={<TodayMeal />} />
        </Routes>
      </BroswerRoter>
    </div>
  );
}

export default App;
