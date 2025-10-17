import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ResetPasswordSchema } from "@/schemas/usersSchema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth.store";


const ResetPassword = () => {
  const { resetPassword, isLoading } = useAuthStore();
  const { userid, token } = useParams();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data) => {
    const { newPassword } = data;

    const res = await resetPassword({ userid, token, newPassword });
    console.log(`this is userid and token: ${res}`)

    if (res.success) {
      toast.success("Password successfully reset!");
      navigate("/login");
    } else {
      toast.error(res.error || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-none bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password and confirm it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                {...register("newPassword")}
                className="focus:ring-2 focus:ring-gray-700"
              />
              {errors.newPassword && (
                <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="focus:ring-2 focus:ring-gray-700"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
