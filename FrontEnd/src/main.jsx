// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TodayMeal from "./pages/TodayMealPage.jsx";
import ClientsListPage from "./pages/ClientsListPage.jsx";
import AddClientPage from "./pages/AddClientPage.jsx";
import MakeMealPage from "./pages/MakeMealsPage.jsx";
import RootLayout from "./components/RootLayout.jsx";
import MealPlanDetailsPage from "./pages/MealPlanDetailsPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./index.css";
import "./styles/themes.css"; // Import the new themes.css
import MealPlansPage from "./pages/MealPlansPage.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "today-meal/:clientId/active",
    element: <TodayMeal />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            path: "dashboard",
            element: <HomePage />,
          },
          {
            path: "clients",
            element: <ClientsListPage />,
          },
          {
            path: "add-client",
            element: <AddClientPage />,
          },
          {
            path: "make-meals/:clientId",
            element: <MakeMealPage />,
          },
          {
            path: "meal-plans/:clientId",
            element: <MealPlansPage />,
          },
          {
            path: "meal-plan-details/:mealPlanId",
            element: <MealPlanDetailsPage />,
          },
          {
            path: "Appointments",
            element: <AppointmentsPage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
