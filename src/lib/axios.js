import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // send cookies automatically
});

// No request interceptor needed (we don't use tokens in header)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ If no refreshToken cookie exists → DON'T try refreshing
    const hasRefreshToken = document.cookie.includes("refreshToken=");
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      hasRefreshToken
    ) {
      originalRequest._retry = true;

      try {
        // Try refresh endpoint
        await axiosInstance.post("/api/users/refresh-token");

        // Retry original request after refresh
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Logout user
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
