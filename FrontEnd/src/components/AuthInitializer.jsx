// src/components/AuthInitializer.jsx
import { useEffect, useState } from "react";
import { refreshAccessToken } from "../services/token";
import useAuthStore from "../context/authStore";

const AuthInitializer = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await refreshAccessToken();
        if (data) {
          setAuthData(data.accessToken, data.accessTokenExpiry, data.user.username);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [setAuthData]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return <>{children}</>;
};

export default AuthInitializer;