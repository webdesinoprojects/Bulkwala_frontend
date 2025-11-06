import React, { useEffect } from "react";
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

  useEffect(() => {
    fetchActiveOffer();
  }, []);

  const onSubmit = async (data) => {
    const res = await startOffer(data);
    if (res.success) toast.success("15-minute offer activated!");
    else toast.error(res.message || "Failed to activate offer");
  };

  const handleDeleteOffer = async () => {
    const res = await deleteOffer();
    if (res.success) toast.success("Offer deleted successfully!");
    else toast.error("Failed to delete offer");
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Flash Offer (15-Min)</CardTitle>
        <CardDescription>
          Start a limited-time 15-minute offer with a global discount.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row items-center gap-4 mb-6"
        >
          <Input
            type="number"
            placeholder="Discount %"
            {...form.register("discountPercent")}
            className="w-full md:w-1/3"
          />
          <Button
            type="submit"
            className="bg-[#02066F] hover:bg-[#0A1280] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Activating..." : "Start 15-Min Offer"}
          </Button>
        </form>

        {activeOffer ? (
          <div className="p-4 bg-green-50 border rounded-xl text-center">
            <h3 className="text-lg font-semibold text-green-700">
              Active Offer: {activeOffer.discountPercent}% OFF
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Ends at:{" "}
              {new Date(activeOffer.expiresAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <Button
              onClick={handleDeleteOffer}
              disabled={isLoading}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Offer
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No active offer.</p>
        )}
      </CardContent>
    </Card>
  );
}
