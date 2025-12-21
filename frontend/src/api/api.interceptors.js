import axios from "axios";
import { BACKEND_PORT } from "../../constants.js";

const baseURL = `http://localhost:${BACKEND_PORT}/api/v1`;

// --------------------------------------------------
// Create API Instance
// --------------------------------------------------
const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Callback injected from StoreContext → for debug panel
let debugLogRefresh = () => {};

function registerRefreshLogger(fn) {
  debugLogRefresh = fn;
}

// --------------------------------------------------
// Refresh Token Queue System
// --------------------------------------------------
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, newToken = null) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(newToken);
  });
  refreshQueue = [];
}

// --------------------------------------------------
// REQUEST INTERCEPTOR → Attach Access Token
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// --------------------------------------------------
// RESPONSE INTERCEPTOR → Handle Access Token Expiry
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired → try refresh
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "ACCESS_TOKEN_EXPIRED"
    ) {
      // Avoid duplicate refresh calls
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");

          const refreshResponse = await api.post("/auth/refresh-access-token", {
            refreshToken,
          });

          const newAT = refreshResponse.data.accessToken;
          const newRT = refreshResponse.data.refreshToken;

          localStorage.setItem("accessToken", newAT);
          localStorage.setItem("refreshToken", newRT);

          debugLogRefresh("success");

          isRefreshing = false;
          processQueue(null, newAT);

          originalRequest.headers.Authorization = `Bearer ${newAT}`;
          return api(originalRequest);
        } catch (refreshErr) {
          debugLogRefresh("failed");

          isRefreshing = false;
          processQueue(refreshErr, null);

          // Force logout
          localStorage.clear();
          window.location.reload();

          return Promise.reject(refreshErr);
        }
      }

      // Already refreshing → queue other API calls
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export { api, registerRefreshLogger };
