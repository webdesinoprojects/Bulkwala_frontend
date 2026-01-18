import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema } from "@/schemas/offerSchema";
import { useOfferStore } from "@/store/offer.store";
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

export default function OfferManager() {
  const { activeOffer, fetchActiveOffer, startOffer, deleteOffer, isLoading } =
    useOfferStore();
  const form = useForm({ resolver: zodResolver(offerSchema) });
  const [countdown, setCountdown] = useState("");

  // 🧭 Fetch and auto-refresh every 10 seconds
  useEffect(() => {
    fetchActiveOffer();
    const interval = setInterval(() => {
      fetchActiveOffer();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ Countdown timer (updates every second)
  useEffect(() => {
    if (!activeOffer?.isActive || !activeOffer?.expiresAt) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(activeOffer.expiresAt).getTime();
      const remaining = Math.max(0, end - now);

      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      if (remaining <= 0) {
        setCountdown("Expired");
      } else {
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);
        setCountdown(parts.join(" "));
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeOffer]);

  const onSubmit = async (data) => {
    const res = await startOffer(data);
    if (res.success) {
      toast.success("Offer activated successfully!");
      form.reset();
      fetchActiveOffer();
    } else toast.error(res.message || "Failed to activate offer");
  };

  const handleDeleteOffer = async () => {
    const res = await deleteOffer();
    if (res.success) {
      toast.success("Offer deleted successfully!");
      fetchActiveOffer();
    } else toast.error("Failed to delete offer");
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Custom Time Offer</CardTitle>
        <CardDescription>
          Create a limited-time offer with custom start and end date/time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mb-6"
        >
          {/* Discount Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Field */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%)
              </label>
              <Input
                type="number"
                placeholder="e.g. 90"
                {...form.register("discountPercent")}
                className={
                  form.formState.errors.discountPercent ? "border-red-500" : ""
                }
              />
              {form.formState.errors.discountPercent && (
                <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                  {form.formState.errors.discountPercent.message}
                </p>
              )}
            </div>

            {/* Max Discount Field */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Max Discount Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g. 500"
                {...form.register("maxDiscountAmount")}
                className={
                  form.formState.errors.maxDiscountAmount ? "border-red-500" : ""
                }
              />
              {form.formState.errors.maxDiscountAmount && (
                <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                  {form.formState.errors.maxDiscountAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Date/Time Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date/Time */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Start Date & Time
              </label>
              <Input
                type="datetime-local"
                {...form.register("startDateTime")}
                className={
                  form.formState.errors.startDateTime ? "border-red-500" : ""
                }
              />
              {form.formState.errors.startDateTime && (
                <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                  {form.formState.errors.startDateTime.message}
                </p>
              )}
            </div>

            {/* End Date/Time */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                End Date & Time
              </label>
              <Input
                type="datetime-local"
                {...form.register("endDateTime")}
                className={
                  form.formState.errors.endDateTime ? "border-red-500" : ""
                }
              />
              {form.formState.errors.endDateTime && (
                <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                  {form.formState.errors.endDateTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-[#02066F] hover:bg-[#0A1280] text-white w-full"
            disabled={isLoading}
          >
            {isLoading ? "Activating..." : "Start Custom Offer"}
          </Button>
        </form>

        {/* Active Offer Section */}
        {activeOffer && activeOffer.isActive ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center transition-all duration-300">
            <h3 className="text-lg font-semibold text-green-700">
              Active Offer: {activeOffer.discountPercent}% OFF up to ₹
              {activeOffer.maxDiscountAmount}
            </h3>

            <p className="text-sm text-gray-700 mt-2">
              ⏳ Ends in:{" "}
              <span className="font-semibold text-green-700">
                {countdown === "Expired" ? "Expired" : countdown}
              </span>
            </p>

            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>
                Started:{" "}
                {activeOffer.startedAt
                  ? new Date(activeOffer.startedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </p>
              <p>
                Ends:{" "}
                {activeOffer.expiresAt
                  ? new Date(activeOffer.expiresAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </p>
            </div>

            <Button
              onClick={handleDeleteOffer}
              disabled={isLoading}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Offer
            </Button>
          </div>
        ) : (
          // Inactive Offer Section
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center transition-all duration-300">
            <h3 className="text-lg font-semibold text-yellow-700">
              🚫 No Active Offer
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new offer by setting values and date/time range above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
