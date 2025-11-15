import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const firstTimerRef = useRef(null);
  const repeatTimerRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  // ----------------------
  // POPUP LOGIC FIXED
  // ----------------------
  useEffect(() => {
    if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
    if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);

    const isAuthPage =
      location.pathname.includes("/login") ||
      location.pathname.includes("/signup");

    if (user?._id || isAuthPage) {
      setOpen(false);
      return;
    }

    firstTimerRef.current = setTimeout(() => {
      setOpen(true);

      repeatTimerRef.current = setInterval(() => {
        const stillValid =
          !user?._id &&
          !(
            location.pathname.includes("/login") ||
            location.pathname.includes("/signup")
          );

        if (stillValid) setOpen(true);
      }, 120000);
    }, 15000);

    return () => {
      if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
      if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
    };
  }, [location, user]);

  // ----------------------
  // SUBMISSION HANDLER
  // ----------------------
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

  // ----------------------
  // JSX FIXED + CLEANED
  // ----------------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-[92%] bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
        {/* HEADER */}
        <DialogHeader
          className="relative text-white py-4 px-6 flex items-center justify-center"
          style={{ backgroundColor: "#AFC2D5" }}
        >
          <div className="flex items-center justify-between w-full max-w-sm">
            <img
              src="https://ik.imagekit.io/bulkwala/demo/bulkwala%20logo.jpg?updatedAt=1762595477453"
              alt="Bulkwala Logo"
              className="w-20 h-20 object-contain"
            />

            <DialogTitle className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
              Join <span className="font-extrabold">Bulkwala</span>
            </DialogTitle>

            <img
              src="https://ik.imagekit.io/bulkwala/demo/cyfty%20logo.png?updatedAt=1762595451720"
              alt="Cyfty Logo"
              className="w-10 h-10 object-contain opacity-85 grayscale-[30%]"
            />
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          <div className="text-center text-gray-700 mb-4">
            <p className="text-[17px] font-semibold">
              Join the <span className="text-[#AFC2D5]">Bulkwala</span> family &
              start saving today!
            </p>
            <p className="text-[15px] font-medium">
              🎁 Your savings journey starts here 🎁
            </p>
            <p className="text-[14px] italic text-gray-600">
              Flat ₹100 off on your first order*
            </p>
          </div>

          <div className="bg-[#F3F6FA] border border-[#D7E2ED] text-[#476A8B] font-semibold rounded-full px-6 py-2 text-center mb-6 text-sm shadow-sm">
            🌟 Free Shipping on Prepaid Orders 🌟
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* PHONE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button
                type="submit"
                className="w-full bg-[#AFC2D5] hover:bg-[#96B4CE] text-white font-semibold rounded-lg py-2.5"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>

              {/* LOGIN LINK */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  className="text-[#476A8B] font-medium cursor-pointer hover:underline"
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
