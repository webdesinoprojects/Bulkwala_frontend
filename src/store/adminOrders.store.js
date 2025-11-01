import { create } from "zustand";
import {
  getAllOrdersService,
  syncShipmentService,
  updateOrderStatusService,
  updatePaymentStatusService,
} from "@/services/admin-orders.service";

export const useAdminOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  filters: {
    q: "",
    status: "ALL",
    paymentStatus: "ALL",
  },

  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
    successPayments: 0,
  },

  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllOrdersService();
      const totalOrders = data.length;
      const totalRevenue = data.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );
      const pending = data.filter((o) => o.status === "Pending").length;
      const delivered = data.filter((o) => o.status === "Delivered").length;
      const cancelled = data.filter((o) => o.status === "Cancelled").length;
      const successPayments = data.filter(
        (o) => (o.paymentStatus || "").toUpperCase() === "SUCCESS"
      ).length;

      set({
        orders: data,
        loading: false,
        stats: {
          totalOrders,
          totalRevenue,
          pending,
          delivered,
          cancelled,
          successPayments,
        },
      });
      return { success: true };
    } catch (e) {
      console.error(e);
      set({
        loading: false,
        error: e?.response?.data?.message || "Failed to fetch orders",
      });
      return {
        success: false,
        message: e?.response?.data?.message || "Failed to fetch orders",
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const updated = await updateOrderStatusService(orderId, status);
      // patch local list
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status: updated.status,
                deliveredAt: updated.deliveredAt,
                cancelledAt: updated.cancelledAt,
              }
            : o
        ),
      }));
      return { success: true };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message: e?.response?.data?.message || "Failed to update status",
      };
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const updated = await updatePaymentStatusService(orderId, paymentStatus);
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId ? { ...o, paymentStatus: updated.paymentStatus } : o
        ),
      }));
      return { success: true };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message:
          e?.response?.data?.message || "Failed to update payment status",
      };
    }
  },

  syncOneOrder: async (orderId) => {
    try {
      const updated = await syncShipmentService(orderId);
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId ? { ...o, ...updated } : o
        ),
      }));
      return { success: true };
    } catch (e) {
      return { success: false, message: "Failed to sync shipment" };
    }
  },
}));
