import { create } from "zustand";
import {
  createOrderService,
  getMyOrdersService,
  getSingleOrderService,
  verifyOrderService,
} from "@/services/order.service";

const useOrderStore = create((set, get) => ({
  orders: [],
  singleOrder: null,
  error: null,
  paymentMode: "",
  isLoading: false,
  paymentStatus: "PENDING",
  orderId: "",
  razorpayOrderId: "",
  amount: 0,

  setPaymentMode: (mode) => set({ paymentMode: mode }),

  handlePayment: async (cart, shippingAddress) => {
    const { paymentMode } = get();

    if (!paymentMode) {
      console.error("No payment mode selected");
      return;
    }

    set({ isLoading: true });

    try {
      const orderPayload = {
        products: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMode,
      };

      // Step 1: Create Order
      const res = await createOrderService(orderPayload);

      console.log("createOrderService response:", res);
      // Step 2: COD flow
      if (paymentMode === "cod") {
        set({ isLoading: false, paymentStatus: "PENDING" });
        return { type: "COD", order: res };
      }

      // Step 3: Online flow
      const { razorpayOrderId, amount, currency } = res;
      set({ razorpayOrderId, amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        order_id: razorpayOrderId,
        name: "Bulkwala Store",
        description: "Order Payment",
        handler: async function (response) {
          console.log("response from razorpay handler", response);
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          set({ isLoading: true });
          try {
            const verifyResponse = await verifyOrderService({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            });

            console.log("✅ verifyOrderService response:", verifyResponse);

            const verifiedOrder = verifyResponse?.populatedOrder;

            // ✅ Stop loader first
            set({ isLoading: false, paymentStatus: "SUCCESS" });

            // ✅ Trigger success event slightly after loader clears
            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("razorpay-success", {
                  detail: { order: verifiedOrder },
                })
              );
            }, 100);
          } catch (error) {
            console.error("Error verifying payment:", error);
            set({ isLoading: false, paymentStatus: "FAILED" });
          }
        },

        modal: {
          ondismiss: () => {
            set({
              paymentStatus: "CANCELLED",
              isLoading: false,
            });
          },
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#02066F" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      return { message: "Razorpay window opened", type: "ONLINE" };
    } catch (error) {
      console.error("Payment initiation failed", error);
      set({ isLoading: false });
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getMyOrdersService();
      set({ orders: res, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        isLoading: false,
      });
    }
  },

  fetchSingleOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getSingleOrderService(orderId);
      set({ singleOrder: res, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: error.response?.data?.message || "Failed to fetch order details",
        isLoading: false,
      });
    }
  },
}));

export default useOrderStore;
