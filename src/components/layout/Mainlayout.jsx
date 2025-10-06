import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const Mainlayout = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
      <Footer />
    </>
  );
};

export default Mainlayout;
