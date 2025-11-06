import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema } from "@/schemas/couponSchema";
import { useCouponStore } from "@/store/coupon.store";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CouponManager() {
  const { coupons, fetchCoupons, createCoupon, deleteCoupon, isLoading } =
    useCouponStore();
  const [deletingId, setDeletingId] = useState(null);

  const form = useForm({ resolver: zodResolver(couponSchema) });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const onSubmit = async (data) => {
    console.log("Form Data on Submit:", data); // Check what is passed to submit
    const res = await createCoupon(data);
    if (res.success) {
      toast.success("Coupon created successfully!");
      form.reset();
    } else toast.error(res.message || "Failed to create coupon");
  };

  const onDelete = async (couponId) => {
    setDeletingId(couponId);
    const res = await deleteCoupon(couponId);
    setDeletingId(null);

    if (res.success) {
      toast.success("Coupon deleted successfully!");
      fetchCoupons(); // ✅ refresh coupons automatically (no page reload)
    } else {
      toast.error(res.message || "Failed to delete coupon");
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Coupon Management</CardTitle>
        <CardDescription>
          Create and manage discount coupons for users.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div>
            <Input placeholder="Coupon Code" {...form.register("code")} />
            {form.formState.errors.code && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>
          <div>
            <select
              {...form.register("discountType")}
              className="border rounded-md px-3 py-2"
              defaultValue="percentage"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>

            {form.formState.errors.discountType && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.discountType.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Discount Value"
              {...form.register("discountValue")}
            />
            {form.formState.errors.discountValue && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.discountValue.message}
              </p>
            )}
          </div>

          <div>
            <Input type="date" {...form.register("expiryDate")} />
            {form.formState.errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.expiryDate.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Min Order Value"
              {...form.register("minOrderValue")}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Usage Limit"
              {...form.register("usageLimit")}
            />
          </div>

          <div className="col-span-full flex justify-end">
            <Button
              type="submit"
              className="col-span-full bg-[#02066F] hover:bg-[#0A1280] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Create Coupon"}
            </Button>
          </div>
        </form>

        {coupons?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Value</th>
                  <th className="p-3 text-left">Expiry</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold">{c.code}</td>
                    <td className="p-3">{c.discountType}</td>
                    <td className="p-3">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>
                    <td className="p-3">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(c._id)}
                        disabled={deletingId === c._id}
                      >
                        {deletingId === c._id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No coupons yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
