import { defineStore } from "pinia";
import { setAuthToken } from "@/axios-instance.js";

interface StoreUser {
  id: string;
  email: string;
  hashed_password: string;
  telegram_id: string | null;
  username: string;
}

interface AuthState {
  token: string | null;
  user: StoreUser | null;
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    token: null,
    user: {
      id: "",
      email: "",
      hashed_password: "",
      telegram_id: null,
      username: "",
    },
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      setAuthToken(token);
    },

    setUser(user: StoreUser) {
      this.user = user;
    },

    logout() {
      this.token = null;
      this.user = null;
      setAuthToken("");
      window.location.href = "/auth";
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  persist: [{ paths: ["token", "user"], storage: localStorage }],
});
