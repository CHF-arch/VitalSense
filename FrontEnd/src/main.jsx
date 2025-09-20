// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
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
import SetCardPage from "./pages/SetCardPage.jsx";
import QuestionnaireTemplatePage from "./pages/QuestionnaireTemplatePage.jsx";
import EditClientMealPlansPage from "./pages/EditClientMealPlansPage.jsx";
import QuestionnaireTemplateEditPage from "./pages/QuestionnaireTemplateEditPage.jsx";
import PrivacyAndTermsPage from "./pages/PrivacyAndTermsPage.jsx";
import EditClientPage from "./pages/EditClientPage.jsx";
import SetCardPCPage from "./pages/SetCardPCPage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import "react-datepicker/dist/react-datepicker.css";
import "./i18n.js";
import "./index.css";
import "./styles/themes.css"; // Import the new themes.css
import MealPlansPage from "./pages/MealPlansPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./hooks/useTheme.js";
import ClientPage from "./pages/ClientPage.jsx";

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
    path: "/privacy-policy",
    element: <PrivacyAndTermsPage />,
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
            path: "clients-list",
            element: <ClientsListPage />,
          },
          {
            path: "clients/:clientId",
            element: <ClientPage />,
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
          {
            path: "set-card/:clientId",
            element: <SetCardPage />,
          },
          {
            path: "set-card-pc/:clientId",
            element: <SetCardPCPage />,
          },
          {
            path: "edit-client/:clientId",
            element: <EditClientPage />,
          },
          {
            path: "questionnaire-templates",
            element: <QuestionnaireTemplatePage />,
          },

          {
            path: "questionnaire-templates/edit/:id",
            element: <QuestionnaireTemplateEditPage />,
          },
          {
            path: "edit-meal-plan/:mealPlanId",
            element: <EditClientMealPlansPage />,
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

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { theme } = useTheme();

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer theme={theme} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>
);
