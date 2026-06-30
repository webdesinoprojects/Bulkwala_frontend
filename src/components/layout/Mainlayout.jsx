import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuthStore } from "@/store/auth.store";
import ScrollToTop from "../ScrollToTop";
import SignupPopup from "../SignupPopup";
import WhatsAppFloatingButton from "../WhatsAppFloatingButton";

const Mainlayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isAdminPanel = location.pathname.toLowerCase().startsWith("/admin");

  const hideFor = ["/login", "/signup"];
  const shouldShowWhatsApp =
    user && !isAdminPanel && !hideFor.includes(location.pathname.toLowerCase());

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <ScrollToTop />
      {!isAdminPanel && <Navbar />}

      <Outlet />

      <Toaster position="top-right" richColors closeButton />
      {!isAdminPanel && <Footer />}

      {!isAdminPanel && <SignupPopup />}

      {shouldShowWhatsApp && <WhatsAppFloatingButton />}
    </div>
  );
};

export default Mainlayout;
