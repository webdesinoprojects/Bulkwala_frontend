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
  changePasswordService,
  updateShippingAddressService,
  updateProfileService,
  registerSellerService,
  verifyOtpService,
  sendOtpService,
} from "@/services/auth.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCartStore from "./cart.store";

export const useAuthStore = create(
  persist((set, get) => ({
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

    sellerSignup: async (sellerData) => {
      set({ isLoading: true, error: null });
      try {
        const newSeller = await registerSellerService(sellerData);
        set({
          pendingVerificationUser: newSeller,
          isLoading: false,
        });
        return { success: true, user: newSeller };
      } catch (error) {
        let message =
          error.response?.data?.message ||
          error.message ||
          "Seller signup failed";
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
        const status = apiError.response?.status;
        const backendData = apiError.response?.data?.data; // ✅ consistent 'data' format

        const errorMessage =
          apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          apiError.message ||
          "Failed to login. Please try again.";

        // ✅ detect 403 email not verified (without breaking structure)
        if (status === 403 && backendData?._id) {
          return {
            success: false,
            error: errorMessage,
            unverifiedUser: backendData, // always { _id, email }
          };
        }

        set({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: errorMessage,
        });

        return { success: false, error: errorMessage };
      }
    },

    otpLoginSend: async (phone) => {
      set({ isLoading: true, error: null });
      try {
        await sendOtpService(phone);
        set({ isLoading: false });
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || "Failed to send OTP";
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    otpLoginVerify: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const user = await verifyOtpService(data);
        set({ user, isLoggedIn: true, isLoading: false });
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true, user };
      } catch (error) {
        const message =
          error.response?.data?.message || "Invalid or expired OTP";
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });

      try {
        await logoutService();
        const { clearCartOnLogout } = useCartStore.getState();
        clearCartOnLogout();

        set({ user: null, isLoggedIn: false, isLoading: false, error: null });
        localStorage.removeItem("user");

        return { success: true };
      } catch (apiError) {
        const errorMessage =
          apiError.message || "Logout failed. Please try again.";

        // Still clear cart even if backend fails, for safety
        const { clearCartOnLogout } = useCartStore.getState();
        clearCartOnLogout();

        set({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    },

    updateAddress: async (addressData) => {
      set({ isLoading: true, error: null });
      try {
        const updatedUser = await updateShippingAddressService(addressData);
        set({ user: updatedUser, isLoading: false });
        return { success: true, user: updatedUser };
      } catch (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }
    },

    checkauthstatus: async () => {
      const state = useAuthStore.getState();

      // Prevent re-checking if already loading or logged in
      if (state.isLoading) return;
      if (state.user && state.isLoggedIn) return;

      try {
        set({ isLoading: true });

        // Check localStorage for existing user data
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.isVerified) {
          set({
            user: storedUser,
            isLoggedIn: true,
          });
          return;
        }

        const user = await checkauthService();
        if (user && user.isVerified) {
          set({
            user,
            isLoggedIn: true,
          });

          // Persist user in localStorage
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          set({
            user: null,
            isLoggedIn: false,
          });
          localStorage.removeItem("user"); // Clear if no valid user
        }
      } catch (error) {
        set({
          user: null,
          isLoggedIn: false,
        });
        localStorage.removeItem("user"); // Clear on error
      } finally {
        set({ isLoading: false });
      }
    },

    verifyEmail: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        await verifyEmailService(credentials);
        set({ isLoading: false });
        return { success: true };
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Verification failed";
        set({ error: message, isLoading: false });
        return { success: false, error: message };
      }
    },

    resendVerification: async (userid) => {
      set({ isLoading: true, error: null });
      try {
        await resendVerificationService(userid);
        set({ isLoading: false });
        return { success: true };
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || "Resend failed";
        set({ error: message, isLoading: false });
        return { success: false, error: message };
      }
    },

    forgetPassword: async (email) => {
      set({ isLoading: true, error: null });
      try {
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
      }
    },

    changePassword: async (email) => {
      set({ isLoading: true, error: null });
      try {
        await changePasswordService(email);
        set({ isLoading: false });
        return { success: true };
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to send reset link";
        set({ error: message, isLoading: false });
        return { success: false, error: message };
      }
    },

    resetPassword: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
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
    updateProfile: async (profileData) => {
      set({ isLoading: true, error: null });
      try {
        const updatedUser = await updateProfileService(profileData);
        set({ user: updatedUser, isLoading: false });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile";
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },
  }))
);

export default useAuthStore;
