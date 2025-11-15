import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

// Add response interceptor to suppress 401 console errors
// 401 errors are expected when users aren't authenticated
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401 errors to console - they're expected behavior
    if (error.response?.status === 401) {
      // Silently return the error for the calling code to handle
      return Promise.reject(error);
    }
    // Log other errors for debugging
    if (error.response?.status >= 500) {
      console.error("Server Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);
