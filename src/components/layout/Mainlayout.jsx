import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import ScrollToTop from "../ScrollToTop";
import SignupPopup from "../SignupPopup";

const Mainlayout = () => {
  const checkauthstatus = useAuthStore((state) => state.checkauthstatus);

  useEffect(() => {
    checkauthstatus();
  }, []);
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
      <Footer />

      {/* <SignupPopup /> */}
    </>
  );
};

export default Mainlayout;
