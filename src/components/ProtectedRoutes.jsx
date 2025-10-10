import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store";
import { toast } from "sonner";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const { user, isLoading, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth status is determined
    if (isLoading) return;

    // Not logged in
    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to access this route!");
      navigate("/login");
      return;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("You do not have permission to access this page!");
      navigate("/");
      return;
    }
  }, [user, isLoading, isLoggedIn, navigate, allowedRoles]);

  // Optional: prevent rendering children while auth state is loading
  if (isLoading || !user) return null;

  return children;
}
