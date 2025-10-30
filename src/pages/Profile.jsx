import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth.store.js";
import { SellerApplicationSchema } from "@/schemas/sellerSchema.js";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { user, applySeller, updateProfile, isLoading } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ include phone number and email in form data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // ✅ handle profile update (name, email, phone)
  const handleUpdate = async (e) => {
    e.preventDefault();

    // check if user tries to change email
    if (formData.email !== user.email) {
      toast.error("Email change requires new registration. Redirecting...");
      setTimeout(() => navigate("/signup"), 1500);
      return;
    }

    const res = await updateProfile(formData);
    if (res.success) {
      toast.success("Profile updated successfully!");
      setEditOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  // ✅ Seller form setup
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

  const roleBadges = {
    admin: "bg-green-500 text-white",
    seller: "bg-blue-500 text-white",
    customer: "bg-yellow-500 text-white",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Profile Card */}
        <Card className="shadow-md border-none bg-white">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-28 w-28 mb-4">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-3xl font-semibold bg-gray-200 text-gray-700">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {user.name}
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              {user.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Phone:</span>
              <span>{user.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Role:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  roleBadges[user.role]
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <Link to="/change-password">
                <Button variant="outline">Change Password</Button>
              </Link>

              {/* ✅ Update Profile Dialog */}
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Update Profile</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                      Edit your name, email, or phone number
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleUpdate} className="space-y-3 mt-3">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter new name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Enter new email"
                      />
                    </div>

                    {/* ✅ Added phone field */}
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Right: Seller / Account Info */}
        <div className="flex flex-col space-y-6">
          {/* Seller Info */}
          <Card className="shadow-md border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your seller or account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.role === "seller" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 font-medium text-lg">
                    Seller Account Active
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
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
                                  placeholder="Enter full pickup address"
                                  {...field}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
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
                                <Input
                                  placeholder="e.g. HDFC Bank"
                                  {...field}
                                />
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
                                <Input
                                  placeholder="e.g. HDFC0001234"
                                  {...field}
                                />
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

          {/* Account Summary */}
          <Card className="shadow-md border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                My Account Summary
              </CardTitle>
              <CardDescription>
                Overview of your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Joined On:</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString() || "N/A"}
                </span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Email Verified:</span>
                <span>{user.isVerified ? "Yes ✅" : "No ❌"}</span>
              </p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-md border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Order Summary
              </CardTitle>
              <CardDescription>
                Track your orders and purchase history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Total Orders:</span>
                <span>{user.totalOrders || 0}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Orders This Month:</span>
                <span>{user.monthlyOrders || 0}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Total Spent:</span>
                <span>₹{user.totalSpent || 0}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
