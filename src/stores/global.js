import { defineStore } from "pinia";
import api from "../api";

function safeParseJSON(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    const rawToken = localStorage.getItem("token");
    const token =
      rawToken && rawToken !== "undefined" && rawToken !== "null"
        ? rawToken
        : null;

    return {
      token,
      user: safeParseJSON("user", null),
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => !!state.user?.isAdmin,
  },
  actions: {
    async register(payload) {
      const { data } = await api.post("/users/register", payload);
      return data;
    },
    async login(credentials) {
      const { data } = await api.post("/users/login", credentials);
      const token = data.token || data.access;
      const userData =
        data.user && typeof data.user === "object"
          ? data.user
          : decodeJwtPayload(token);

      if (token) {
        this.token = token;
        localStorage.setItem("token", token);
      } else {
        this.token = null;
        localStorage.removeItem("token");
      }

      if (userData && typeof userData === "object") {
        this.user = userData;
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        this.user = null;
        localStorage.removeItem("user");
      }

      return data;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});