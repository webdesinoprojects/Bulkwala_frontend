import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "./components/layout/Mainlayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
      // {
      //   path: "verify/:userid",
      //   element: <VerificationPage />,
      // },
      // {
      //   path: "reset-password/:userid/:token",
      //   element: <ResetPasswordPage />,
      // },
    ],
  },
]);

export default App;
