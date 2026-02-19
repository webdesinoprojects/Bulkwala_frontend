import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerSchema } from "@/schemas/bannerSchema";
import { useBannerStore } from "@/store/banner.store";
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
import { Label } from "@/components/ui/label";

export default function BannerManager() {
  const {
    banners,
    fetchBanners,
    uploadBanner,
    toggleBanner,
    deleteBanner,
    isLoading,
  } = useBannerStore();

  // ✅ React Hook Form setup
  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: { title: "", ctaLink: "", position: "top", images: [] },
  });

  const [activeTab, setActiveTab] = useState("top");

  useEffect(() => {
    fetchBanners();
    console.log("Fetching banners for admin", banners);
  }, []);

  // ✅ Update position in form when tab changes
  useEffect(() => {
    form.setValue("position", activeTab);
  }, [activeTab, form]);

  // ✅ Handle submit
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("ctaLink", data.ctaLink || "");
      formData.append("position", activeTab); // Use activeTab directly
      Array.from(data.images || []).forEach((file) =>
        formData.append("images", file)
      );

      const res = await uploadBanner(formData);
      if (res.success) {
        toast.success("Banner uploaded successfully!");
        form.reset();
        // Refresh banners to show the newly uploaded banner
        await fetchBanners();
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Error uploading banner");
    }
  };

  const handleDeactivate = async (bannerId) => {
    try {
      const res = await toggleBanner(bannerId);
      if (res.success) {
        toast.success("Banner deactivated");
      } else {
        toast.error("Error deactivating banner");
      }
    } catch (err) {
      toast.error("Error deactivating banner");
    }
  };

  const handleDelete = async (bannerId) => {
    try {
      const res = await deleteBanner(bannerId);
      if (res.success) {
        toast.success("Banner deleted successfully");
      } else {
        toast.error("Error deleting banner");
      }
    } catch (err) {
      toast.error("Error deleting banner");
    }
  };

  const topBanners = banners?.filter((b) => (b.position || "top") === "top") || [];
  const midBanners = banners?.filter((b) => b.position === "mid") || [];
  const bottomBanners = banners?.filter((b) => b.position === "bottom") || [];
  const currentBanners = activeTab === "top" ? topBanners : activeTab === "mid" ? midBanners : bottomBanners;
  const bannerLimit = 20;
  const canAddMore = currentBanners.length < bannerLimit;

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm w-full ">
      <CardHeader>
        <CardTitle className="text-[#02066F] font-semibold">
          Manage Banners
        </CardTitle>
        <CardDescription>
          Upload and manage banners for top, middle, and bottom sections. Up to <strong>{bannerLimit} banners</strong> per position.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ Banner Position Tabs */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("top");
              form.reset({ title: "", ctaLink: "", position: "top", images: [] });
            }}
            className={`px-4 py-2 font-medium transition-all whitespace-nowrap ${
              activeTab === "top"
                ? "text-[#02066F] border-b-2 border-[#02066F]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Top Banners ({topBanners.length}/{bannerLimit})
          </button>
          <button
            onClick={() => {
              setActiveTab("mid");
              form.reset({ title: "", ctaLink: "", position: "mid", images: [] });
            }}
            className={`px-4 py-2 font-medium transition-all whitespace-nowrap ${
              activeTab === "mid"
                ? "text-[#02066F] border-b-2 border-[#02066F]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Mid Banners ({midBanners.length}/{bannerLimit})
          </button>
          <button
            onClick={() => {
              setActiveTab("bottom");
              form.reset({ title: "", ctaLink: "", position: "bottom", images: [] });
            }}
            className={`px-4 py-2 font-medium transition-all whitespace-nowrap ${
              activeTab === "bottom"
                ? "text-[#02066F] border-b-2 border-[#02066F]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Bottom Banners ({bottomBanners.length}/{bannerLimit})
          </button>
        </div>

        {/* Upload Form */}
        {canAddMore && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Title */}
              <div className="flex flex-col space-y-1">
                <Label>Title</Label>
                <Input
                  type="text"
                  placeholder="Banner title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* CTA Link */}
              <div className="flex flex-col space-y-1">
                <Label>CTA Link</Label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...form.register("ctaLink")}
                />
                {form.formState.errors.ctaLink && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.ctaLink.message}
                  </p>
                )}
              </div>

              {/* Images */}
              <div className="flex flex-col space-y-1">
                <Label>Banner Images (1–3)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  {...form.register("images", {
                    validate: (files) =>
                      files.length > 0 || "Please upload at least one image",
                  })}
                />
                {form.formState.errors.images && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.images.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className={`bg-[#02066F] hover:bg-[#0A1280] text-white ${
                  isLoading && "opacity-70 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Uploading..." : "Upload Banner"}
              </Button>
            </div>
          </form>
        )}

        {!canAddMore && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              ⚠️ You've reached the maximum limit of {bannerLimit} banners for {activeTab} position. Delete some to add more.
            </p>
          </div>
        )}

        {/* Uploaded Banners */}
        {currentBanners?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
            {currentBanners.map((banner) => (
              <div
                key={banner._id}
                className="relative border border-gray-200 rounded-xl p-3 bg-gray-50 hover:shadow-lg transition-all duration-200"
              >
                {/* Active Badge */}
                {banner.isActive && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}

                <div className="flex flex-col items-center">
                  {/* Show images */}
                  <div className="flex gap-2 justify-center flex-wrap mb-3">
                    {banner.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={banner.title || "Banner"}
                        className="w-28 h-28 object-cover rounded-md border"
                      />
                    ))}
                  </div>

                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    {banner.title || "Untitled"}
                  </p>

                  <div className="flex gap-4 justify-center items-center  p-2 w-full ">
                    {/* Deactivate Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        banner.isActive
                          ? "bg-gray-300 hover:bg-gray-400 text-black"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      } w-1/2`}
                      onClick={() => handleDeactivate(banner._id)}
                    >
                      {banner.isActive ? "Deactivate" : "Activate"}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(banner._id)}
                      className="w-1/2 bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No banners uploaded for {activeTab} position yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
