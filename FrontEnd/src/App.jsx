import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RootLayout from "./components/RootLayout.jsx";
import MealPlansPage from "./pages/MealPlansPage.jsx";
import MealPlanDetailsPage from "./pages/MealPlanDetailsPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import React from "react";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="meal-plans/:clientId" element={<MealPlansPage />} />
          <Route path="meal-plan-details/:mealPlanId" element={<MealPlanDetailsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
