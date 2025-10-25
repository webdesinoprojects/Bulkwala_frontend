import { create } from "zustand";
import {
  createOrderService,
  verifyOrderService,
} from "@/services/order.service";

const useOrderStore = create((set, get) => ({
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
        return { message: "COD order placed successfully", type: "COD" };
      }

      // Step 3: Online flow
      const { razorpayOrderId, orderId, amount } = res;
      set({ razorpayOrderId, orderId, amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "Bulkwala Store",
        description: "Order Payment",
        handler: async function (response) {
          console.log("response from razorpay handler", response);
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          await verifyOrderService({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });

          set({
            paymentStatus: "SUCCESS",
            isLoading: false,
          });
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
}));

export default useOrderStore;
