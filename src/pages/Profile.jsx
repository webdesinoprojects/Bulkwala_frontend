import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth.store.js";
import { SellerApplicationSchema } from "@/schemas/sellerSchema.js";

const Profile = () => {
  const { user, applySeller, isLoading } = useAuthStore();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(SellerApplicationSchema),
    defaultValues: {
      businessName: "",
      gstNumber: "",
      pickupAddress: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await applySeller(values);
    if (res.success) {
      toast.success("Seller application submitted successfully!");
      setOpen(false);
      form.reset();
    } else {
      toast.error(res.error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Failed to load profile.
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "Not provided"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user.role}</span>
          </p>

          {user.role === "seller" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">
                Seller Account Active
              </p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                {user?.sellerDetails?.approved
                  ? "Approved ✅"
                  : "Pending Review ⏳"}
              </p>
            </div>
          )}

          {user.role === "customer" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">Become a Seller</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Apply for a Seller</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 mt-3"
                  >
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter business name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pickupAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Address</FormLabel>
                          <FormControl>
                            <textarea
                              rows={3}
                              placeholder="Enter full pickup address (with landmark, city, and pincode)"
                              {...field}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. HDFC Bank" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter account number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ifsc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. HDFC0001234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full mt-3"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Submitting..."
                          : "Submit Application"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
