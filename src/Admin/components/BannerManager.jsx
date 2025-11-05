import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerSchema } from "@/validators/banner.schema";
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

export default function BannerManager() {
  const { banners, fetchBanners, uploadBanner, deactivateBanner, isLoading } =
    useBannerStore();
  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: { title: "", ctaLink: "", images: [] },
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("ctaLink", data.ctaLink || "");
      for (const file of data.images) formData.append("images", file);

      const res = await uploadBanner(formData);
      if (res.success) {
        toast.success("Banner uploaded successfully!");
        form.reset();
      } else toast.error(res.message || "Upload failed");
    } catch (err) {
      toast.error("Error uploading banner");
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Manage Banners</CardTitle>
        <CardDescription>
          Upload up to 3 banner images that appear on the home page.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Input
            type="text"
            placeholder="Title (optional)"
            {...form.register("title")}
          />
          <Input
            type="url"
            placeholder="CTA Link (optional)"
            {...form.register("ctaLink")}
          />
          <Input
            type="file"
            multiple
            accept="image/*"
            {...form.register("images")}
          />
          <Button
            type="submit"
            className="col-span-full bg-[#02066F] hover:bg-[#0A1280] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload Banner"}
          </Button>
        </form>

        {banners?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="border rounded-xl p-3 bg-gray-50 text-center"
              >
                <img
                  src={banner.images[0]}
                  alt={banner.title}
                  className="h-40 w-full object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {banner.title || "Untitled"}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    const res = await deactivateBanner(banner._id);
                    res.success
                      ? toast.success("Banner removed")
                      : toast.error(res.message);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No banners uploaded.</p>
        )}
      </CardContent>
    </Card>
  );
}
