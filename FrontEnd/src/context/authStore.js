import {create} from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  accessTokenExpiry: null,
  username: null,
  setAuthData: (token, accessTokenExpiry, username) =>
    set({ token, accessTokenExpiry, username }),
  clearAuthData: () =>
    set({ token: null, accessTokenExpiry: null, username: null }),
}));

export default useAuthStore;
