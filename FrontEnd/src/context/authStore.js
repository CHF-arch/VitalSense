import {create} from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      accessTokenExpiry: null,
      username: null,
      setAuthData: (token, accessTokenExpiry, username) =>
        set({ token, accessTokenExpiry, username }),
      clearAuthData: () =>
        set({ token: null, accessTokenExpiry: null, username: null }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
