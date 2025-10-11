import {
  applySellerService,
  approveSellerService,
  checkauthService,
  forgotPasswordService,
  getAllUsersService,
  loginService,
  logoutService,
  registerService,
  rejectSellerService,
  resendVerificationService,
  resetPasswordService,
  verifyEmailService,
} from "@/services/auth.service";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  allUsers: [],
  isLoading: false,
  pendingVerificationUser: null,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newRegisterUser = await registerService(userData);
      set({
        pendingVerificationUser: newRegisterUser,
        isLoading: false,
      });
      return { success: true, user: newRegisterUser };
    } catch (error) {
      let message =
        error.response?.data?.message || error.message || "Signup failed";
      set({ error: message, isLoading: false });

      return { success: false, error: message };
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
    const state = useAuthStore.getState();
    if (state.isLoading) return;
    if (state.user && state.isLoggedIn) return;
    try {
      set({ isLoading: true });
      const user = await checkauthService();
      if (user && user.isVerified) {
        set({
          user,
          isLoggedIn: true,
        });
      } else {
        set({
          user: null,
          isLoggedIn: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        isLoggedIn: false,
      });
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

  applySeller: async (sellerData) => {
    set({ isLoading: true });
    try {
      const user = await applySellerService(sellerData);
      set({ user, isLoading: false });
      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to apply for seller";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await getAllUsersService();
      set({ allUsers: users, isLoading: false });
      return { success: true, users };
    } catch (error) {
      set({ isLoading: false, error: "Failed to fetch users" });
      return { success: false, error };
    }
  },

  approveSeller: async (userid) => {
    set({ isLoading: true });
    try {
      await approveSellerService(userid);
      await useAuthStore.getState().fetchAllUsers(); // refresh list
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: "Failed to approve seller" });
      return { success: false, error };
    }
  },

  rejectSeller: async (userid) => {
    set({ isLoading: true });
    try {
      await rejectSellerService(userid);
      await useAuthStore.getState().fetchAllUsers(); // refresh list
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: "Failed to reject seller" });
      return { success: false, error };
    }
  },
}));

export default useAuthStore;
