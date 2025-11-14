import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import ScrollToTop from "../ScrollToTop";
import SignupPopup from "../SignupPopup";
import WhatsAppFloatingButton from "../WhatsAppFloatingButton"; 

const Mainlayout = () => {
  const checkauthstatus = useAuthStore((state) => state.checkauthstatus);
  const { user } = useAuthStore(); // ✅ get logged-in user
  const location = useLocation();  // ✅ to hide on login/signup

  useEffect(() => {
    checkauthstatus();
  }, []);

  // Hide WhatsApp button on these routes
  const hideFor = ["/login", "/signup"];
  const shouldShowWhatsApp =
    user && !hideFor.includes(location.pathname.toLowerCase());

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Outlet />

      <Toaster position="top-right" richColors />
      <Footer />

      <SignupPopup />

      {/* ✅ Show floating WhatsApp icon only after login and NOT on login/signup */}
      {shouldShowWhatsApp && <WhatsAppFloatingButton />}
    </>
  );
};

export default Mainlayout;