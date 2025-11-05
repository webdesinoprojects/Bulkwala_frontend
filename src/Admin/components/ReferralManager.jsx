import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { referralSchema } from "@/validators/referral.schema";
import { useReferralStore } from "@/store/referral.store";
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

export default function ReferralManager() {
  const { referrals, fetchReferrals, createReferral, isLoading } =
    useReferralStore();
  const form = useForm({ resolver: zodResolver(referralSchema) });

  useEffect(() => {
    fetchReferrals();
  }, []);

  const onSubmit = async (data) => {
    const res = await createReferral(data);
    if (res.success) {
      toast.success("Referral code created successfully!");
      form.reset();
    } else toast.error(res.message || "Failed to create referral");
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Referral Management</CardTitle>
        <CardDescription>
          Assign referral codes to influencers for audience discounts.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Input
            placeholder="Influencer ID"
            {...form.register("influencerId")}
          />
          <Input placeholder="Referral Code" {...form.register("code")} />
          <Input
            type="number"
            placeholder="Discount %"
            {...form.register("discountPercent")}
          />
          <Button
            type="submit"
            className="col-span-full bg-[#02066F] hover:bg-[#0A1280] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Create Referral"}
          </Button>
        </form>

        {referrals?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="p-3 text-left">Influencer</th>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Discount</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{r.influencerId}</td>
                    <td className="p-3 font-semibold">{r.code}</td>
                    <td className="p-3">{r.discountPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No referrals yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
