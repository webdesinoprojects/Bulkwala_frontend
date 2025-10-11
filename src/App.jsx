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
import TermsAndConditions from "./requiredpages/Term&Condition";
import PrivacyPolicy from "./requiredpages/PrivacyPolicy";
import ShippingPolicy from "./requiredpages/ShipingPolicy";
import RefundAndReturnPolicy from "./requiredpages/Refund&ReturnPolicy";
import Profile from "./pages/Profile";

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
      {
        path: "/profile",
        element: (
          <ProtectedRoutes
            allowedRoles={[ROLES.ADMIN, ROLES.SELLER, ROLES.CUSTOMER]}
          >
            <Profile />
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

      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/shipping-policy",
        element: <ShippingPolicy />,
      },
      {
        path: "/refund-and-return-policy",
        element: <RefundAndReturnPolicy />,
      },
    ],
  },
]);

export default App;
