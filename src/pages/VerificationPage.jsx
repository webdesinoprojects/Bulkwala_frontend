import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerificationPage = () => {
  const [token, setToken] = useState("");
  const { userid } = useParams();
  const navigate = useNavigate();
  const {
    verifyEmail,
    resendVerification,
    isLoading,
    pendingVerificationUser,
  } = useAuthStore();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!userid) {
      toast.error("User ID not found in URL.");
      return;
    }

    const res = await verifyEmail({ userid, token });

    if (res.success) {
      toast.success("Email verified successfully! You can now log in.");
      navigate("/login");
    } else {
      toast.error(res.error || "Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!pendingVerificationUser) {
      toast.error("No user found for resending.");
      return;
    }

    const res = await resendVerification({
      email: pendingVerificationUser.email,
    });

    if (res.success) {
      toast.success("New verification token sent! Please check your email.");
    } else {
      toast.error(res.error || "Failed to resend token.");
    }
  };

  if (!pendingVerificationUser) {
    // navigate("/signup");
    // return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Card className="w-full max-w-sm bg-gradient-to-l from-zinc-400 to-white border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            A 6-digit code has been sent to{" "}
            <span className="font-semibold">
              {pendingVerificationUser.email}
            </span>
            . Please enter it below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest border-gray-900"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 px-5 rounded-full cursor-pointer"
            >
              {isLoading ? "Verifying..." : "Submit Code"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Resend Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;
