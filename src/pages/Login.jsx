import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useAuthStore from "@/store/auth.store.js";
import { LoginSchema } from "@/schemas/usersSchema.js";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await login(values);
    if (res.success && res.user?._id) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(res.error || "Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl bg-white">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold text-[#02066F] mb-6">
            Welcome Back 👋
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full mt-4 bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 transition-all"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          {/* Forgot password + Signup link */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#02066F] font-medium hover:underline"
            >
              Forgot Password?
            </button>

            <p className="mt-3 sm:mt-0">
              Don’t have an account?{" "}
              <span
                className="text-[#02066F] font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
