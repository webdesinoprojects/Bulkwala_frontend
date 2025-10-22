import { create } from "zustand";
import { toast } from "sonner";
import { createPaymentOrder, verifyPayment } from "@/services/payment.service";
import { paymentSchema } from "../schemas/paymentSchema";
import useCartStore from "@/store/cart.store";

const usePaymentStore = create((set, get) => ({
  paymentMode: "",
  isLoading: false,

  setPaymentMode: (mode) => set({ paymentMode: mode }),

  initiatePayment: async () => {
    const { paymentMode } = get();
    const { totalAmount, clearCart } = useCartStore.getState();

    try {
      paymentSchema.parse({
        amount: totalAmount,
        paymentMode,
      });

      set({ isLoading: true });

      if (paymentMode === "cod") {
        toast.success("Order placed successfully (COD)!");
        clearCart();
        set({ isLoading: false });
        return;
      }

      const res = await createPaymentOrder({
        amount: totalAmount,
        paymentMode,
      });

      if (!res?.order?.id) {
        toast.error("Failed to create Razorpay order");
        set({ isLoading: false });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: "INR",
        name: "Bulkwala",
        description: `Payment for ₹${totalAmount}`,
        order_id: res.order.id,
        handler: async function (response) {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            toast.success("Payment verified successfully!");
            clearCart();
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#111",
        },
        method: {
          netbanking: paymentMode === "netbanking",
          card: paymentMode === "online",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
      toast.error(error.errors ? error.errors[0].message : "Payment failed");
      set({ isLoading: false });
    }
  },
}));

export default usePaymentStore;
