import axios from "axios";

// Create the axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // To include cookies with requests, if needed
});

// Interceptor for request to automatically include the access token in the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Attach token if available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and retry logic
axiosInstance.interceptors.response.use(
  (response) => response, // Allow successful responses
  async (error) => {
    // If the error is due to token expiration (401)
    if (error.response?.status === 401) {
      // Try refreshing the token
      try {
        // Check if refreshToken exists in localStorage
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          // Attempt to refresh the access token
          const refreshResponse = await axios.post("/api/users/refresh", {
            refreshToken,
          });

          // If refresh is successful, update the tokens
          if (refreshResponse.data.accessToken) {
            localStorage.setItem(
              "accessToken",
              refreshResponse.data.accessToken
            );
            localStorage.setItem(
              "refreshToken",
              refreshResponse.data.refreshToken
            );

            // Retry the original request with the new access token
            error.config.headers[
              "Authorization"
            ] = `Bearer ${refreshResponse.data.accessToken}`;
            return axios(error.config); // Retry the request with the new token
          }
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }

      // If refresh fails or no refresh token is available, log out the user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Optionally, redirect the user to the login page or show a login modal
      window.location.href = "/login"; // Or use your preferred navigation method

      // Reject the error after logging out
      return Promise.reject(error);
    }

    // Handle other types of errors (e.g., 500 server errors)
    if (error.response?.status >= 500) {
      console.error("Server Error:", error.response?.data || error.message);
    }

    return Promise.reject(error); // Reject the promise for further handling
  }
);
