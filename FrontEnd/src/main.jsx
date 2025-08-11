// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TodayMeal from "./pages/TodayMealPage.jsx";
import ClientsListPage from "./pages/ClientsListPage.jsx";
import AddClientPage from "./pages/AddClientPage.jsx";
import MakeMealPage from "./pages/MakeMealsPage.jsx";
import RootLayout from "./components/RootLayout.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./index.css";
import "./styles/themes.css"; // Import the new themes.css

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: "/dashboard",
        element: <HomePage />,
      },
      {
        path: "/today-meal/client/:clientId",
        element: <TodayMeal />,
      },
      {
        path: "/clients",
        element: <ClientsListPage />,
      },
      {
        path: "/add-client",
        element: <AddClientPage />,
      },
      {
        path: "/make-meals/:clientId",
        element: <MakeMealPage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
