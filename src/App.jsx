import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "./components/layout/Mainlayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerificationPage from "./pages/VerificationPage";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import Products from "./pages/Products";
import ProtectedRoutes from "./components/ProtectedRoutes";

// Define role constants for clarity
const ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  CUSTOMER: "customer",
};

const App = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "verify/:userid",
        element: <VerificationPage />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoutes allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoutes>
        ),
      },
      // Example for seller route
      // {
      //   path: "/seller",
      //   element: (
      //     <ProtectedRoutes allowedRoles={[ROLES.SELLER]}>
      //       <SellerDashboard />
      //     </ProtectedRoutes>
      //   ),
      // },
    ],
  },
]);

export default App;
