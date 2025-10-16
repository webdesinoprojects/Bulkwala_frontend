import { axiosInstance } from "@/lib/axios";

export const registerService = async (userData) => {
  const res = await axiosInstance.post("/api/users/register", userData);
  return res.data.data;
};

export const loginService = async (credentials) => {
  const res = await axiosInstance.post("/api/users/login", credentials);
  return res.data.data;
};

export const checkauthService = async () => {
  const res = await axiosInstance.get("/api/users/profile");
  return res.data.data;
};

export const verifyEmailService = async ({ userid, token }) => {
  const res = await axiosInstance.post(`/api/users/verify/${userid}`, {
    token,
  });
  return res.data;
};

export const resendVerificationService = async (email) => {
  const res = await axiosInstance.post("/api/users/resend-verification", {
    email,
  });
  return res.data;
};

export const logoutService = async () => {
  await axiosInstance.post("/api/users/logout");
  return { success: true };
};

export const forgotPasswordService = async (email) => {
  const res = await axiosInstance.post("/api/users/forget-password", { email });
  return res.data;
};
export const changePasswordService = async (email) => {
  const res = await axiosInstance.post("/api/users/change-password", { email });
  return res.data;
};

export const resetPasswordService = async (credentials) => {
  const { userid, token, newPassword } = credentials;
  const res = await axiosInstance.post(
    `/api/users/reset-password/${userid}/${token}`,
    { newPassword }
  );
  return res.data;
};

//  Apply for seller
export const applySellerService = async (sellerData) => {
  const res = await axiosInstance.post("/api/users/apply-seller", sellerData, {
    withCredentials: true,
  });
  return res.data.data;
};

//  Fetch all users (admin only)
export const getAllUsersService = async () => {
  const res = await axiosInstance.get("/api/users", { withCredentials: true });
  return res.data.data;
};

//  Approve pending seller
export const approveSellerService = async (userid) => {
  const res = await axiosInstance.put(
    `/api/users/sellers/approve/${userid}`,
    {},
    { withCredentials: true }
  );
  return res.data.data;
};

// Reject pending seller
export const rejectSellerService = async (userid) => {
  const res = await axiosInstance.put(
    `/api/users/sellers/reject/${userid}`,
    {},
    { withCredentials: true }
  );
  return res.data.data;
};
