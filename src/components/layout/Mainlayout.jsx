import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Mainlayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
      <Footer />
    </>
  );
};

export default Mainlayout;
