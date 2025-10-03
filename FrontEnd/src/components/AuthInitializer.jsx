// src/components/AuthInitializer.jsx
import { useEffect, useState } from "react";
import { refreshAccessToken } from "../services/token";

const AuthInitializer = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return <>{children}</>;
};

export default AuthInitializer;