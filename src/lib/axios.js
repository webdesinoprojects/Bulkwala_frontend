import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // IMPORTANT: allows sending cookies
});

// Request interceptor — add token from localStorage if cookies aren't available
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (fallback for cross-domain requests)
    const token = localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired (401) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh-token endpoint itself to avoid infinite loops
      if (originalRequest.url?.includes('/refresh-token')) {
        // Clear tokens on refresh failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}
          }
        );

        // Store new tokens
        if (response.data.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.data.accessToken);
        }
        if (response.data.data?.refreshToken) {
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
        }

        // Update original request with new token
        const newToken = response.data.data?.accessToken;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → logout (expected for unauthenticated users)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
