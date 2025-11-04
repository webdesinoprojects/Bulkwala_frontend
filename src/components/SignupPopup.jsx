import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/schemas/usersSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function SignupPopup() {
  const [open, setOpen] = useState(false);
  const { user, signup } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // Auto popup every 30s
  useEffect(() => {
    if (user?._id) return;
    const timer = setInterval(() => {
      if (!user?._id) setOpen(true);
    }, 15000);
    return () => clearInterval(timer);
  }, [user]);

  const onSubmit = async (values) => {
    const res = await signup(values);
    if (res.success && res.user?._id) {
      toast.success("Account created successfully! Please verify your email.");
      form.reset();
      setOpen(false);
      navigate(`/verify/${res.user._id}`);
    } else {
      toast.error(res.error || "Signup failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-[92%] bg-white rounded-2xl shadow-2xl overflow-hidden border-0 p-0 animate-fadeIn text-gray-500">
        {/* Header */}
        <DialogHeader className="relative bg-gradient-to-r from-[#02066F] to-[#04127A] text-white py-5 px-6">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Join Bulkwala
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 sm:p-8 bg-white">
          <p className="text-sm text-gray-600 text-center mb-5">
            Sign up to get exclusive offers, member discounts & faster checkout
            🚀
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F] transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm">
                      Password
                    </FormLabel>
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

              <Button
                type="submit"
                className="w-full bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 mt-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-2">
                Already have an account?{" "}
                <span
                  className="text-[#02066F] font-medium cursor-pointer hover:underline"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Log in
                </span>
              </p>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
