import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const { user, isLoading, isLoggedIn } = useAuthStore();

  // 🟣 1. While auth is being checked
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white text-[#02066F]">
        <Loader2 className="animate-spin w-10 h-10 mb-3 text-[#02066F]" />
        <p className="text-base font-medium">Checking authentication...</p>
      </div>
    );
  }

  // 🔴 2. Not logged in
  if (!isLoggedIn || !user) {
    // fire once, just before redirect
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  // 🟠 3. Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error("You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  // 🟢 4. All good
  return children;
}
