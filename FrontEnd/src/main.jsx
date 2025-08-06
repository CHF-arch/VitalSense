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

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/meal",
    element: <TodayMeal />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/clients",
    element: <ClientsListPage />,
  },
  {
    path: "/add-client",
    element: <AddClientPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
