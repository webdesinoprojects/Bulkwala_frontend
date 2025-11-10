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
import { SignupSchema } from "@/schemas/userSchema";
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
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

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
      <DialogContent
        className="max-w-md w-[92%] h-fit bg-white rounded-2xl shadow-2xl overflow-hidden border-0 p-0 animate-fadeIn text-gray-500 sm:max-h-[90vh]
        scrollbar-hide hover:scrollbar-show transition-all duration-300 ease-in-out"
      >
        {/* Header */}
        <DialogHeader className="relative bg-[#02066F] text-white py-5 px-6 rounded-t-2xl flex items-center justify-center shadow-md">
          <div className="flex items-center justify-between w-full max-w-sm">
            {/* Left Logo */}
            <img
              src="https://ik.imagekit.io/bulkwala/demo/bulkwala%20logo.jpg?updatedAt=1762595477453"
              alt="Bulkwala Logo"
              className="w-16 h-16 object-contain rounded-md shadow-md"
            />

            {/* Center Title */}
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-white whitespace-nowrap">
              Join Bulkwala
            </DialogTitle>

            {/* Right Logo */}
            <img
              src="https://ik.imagekit.io/bulkwala/demo/cyfty%20logo.png?updatedAt=1762595451720"
              alt="Cyfty Logo"
              className="w-14 h-14 object-contain rounded-md shadow-md"
            />
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 sm:p-8 bg-white max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#02066F]/40 scrollbar-track-transparent hover:scrollbar-thumb-[#02066F]/60">
          {/* Description Section */}
          <div className="text-center text-gray-700 space-y-1.5 mb-4">
            <p className="text-[17px] sm:text-[18px] font-semibold">
              Join the{" "}
              <span className="font-bold text-[#02066F]">Bulkwala</span> family
              & start saving today!
            </p>
            <p className="text-[15px] sm:text-[16px] font-medium">
              🎁 Your savings journey starts here 🎁
            </p>
            <p className="text-[14px] sm:text-[15px] italic text-gray-600">
              Don’t miss out on amazing offers and rewards ✨
            </p>
          </div>

          {/* Offer Highlight */}
          <div className="bg-[#f1f4ff] border border-[#dbe1ff] text-[#02066F] font-semibold rounded-full px-6 py-2 text-center mb-6 text-sm sm:text-[15px] shadow-sm">
            🌟 Free Shipping on Prepaid Orders 🌟
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
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

              {/* Email Address */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
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

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
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
                    <FormLabel className="text-gray-700 text-sm font-medium">
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 mt-2 shadow-md"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>

              {/* Login Link */}
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
