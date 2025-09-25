import {
  checkauthService,
  forgotPasswordService,
  loginService,
  logoutService,
  registerService,
  resendVerificationService,
  resetPasswordService,
  verifyEmailService,
} from "@/services/auth.service";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  pendingVerificationUser: null,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newRegisterUser = await registerService(userData);
      set({
        user: newRegisterUser,
        isLoading: false,
        isLoggedIn: true,
        error: null,
      });
      return { success: true, user: newRegisterUser };
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Failed to register. Please try again.";
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await loginService(credentials);

      set({
        user: userData,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user: userData };
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Failed to login. Please try again.";
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await logoutService();

      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
      return { success: true };
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Logout failed. Please try again.";
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  checkauthstatus: async () => {
    try {
      set({ isLoading: true });
      const user = await checkauthService();
      if (user && user.isVerified) {
        set({ user, isLoggedIn: true });
        return { success: true, user };
      }
      set({ user: null, isLoggedIn: false });
      return { success: false, error: "Authentication failed." };
    } catch (error) {
      set({ user: null, isLoggedIn: false, isLoading: false });
      return { success: false, error: "Failed to check auth status" };
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      await verifyEmailService(credentials);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Verification failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    } finally {
      set({ isLoading: false });
    }
  },

  resendVerification: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await resendVerificationService(data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Resend failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    } finally {
      set({ isLoading: false });
    }
  },

  forgetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      await forgotPasswordService(email);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      await resetPasswordService(credentials);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
