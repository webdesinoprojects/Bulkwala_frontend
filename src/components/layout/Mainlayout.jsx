import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Header from "./Header";

const Mainlayout = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  );
};

export default Mainlayout;
