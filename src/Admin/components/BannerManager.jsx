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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";

function SortableBannerCard({ banner, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border border-gray-200 rounded-xl p-3 bg-gray-50 hover:shadow-lg transition-all duration-200"
    >
      {banner.isActive && (
        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-10">
          Active
        </span>
      )}

      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded-md transition-colors mt-2"
        >
          <GripVertical className="w-5 h-5 text-gray-500" />
        </div>

        <div className="flex-1">
          <div className="flex gap-2 justify-start flex-wrap mb-3">
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`${
                banner.isActive
                  ? "bg-gray-300 hover:bg-gray-400 text-black"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={() => onToggle(banner._id)}
            >
              {banner.isActive ? "Deactivate" : "Activate"}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(banner._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BannerManager() {
  const {
    banners,
    fetchBanners,
    uploadBanner,
    toggleBanner,
    deleteBanner,
    updateBannerPriorities,
    isLoading,
  } = useBannerStore();

  // ✅ React Hook Form setup
  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: { title: "", ctaLink: "", position: "top", images: [] },
  });

  const [activeTab, setActiveTab] = useState("top");
  const [localBanners, setLocalBanners] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners) {
      const sorted = [...banners].sort((a, b) => (a.priority || 0) - (b.priority || 0));
      setLocalBanners(sorted);
    }
  }, [banners]);

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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = currentBanners.findIndex((b) => b._id === active.id);
    const newIndex = currentBanners.findIndex((b) => b._id === over.id);

    const reordered = arrayMove(currentBanners, oldIndex, newIndex);
    const updates = reordered.map((banner, idx) => ({
      id: banner._id,
      priority: idx,
    }));

    const updatedLocalBanners = localBanners.map((banner) => {
      const update = updates.find((u) => u.id === banner._id);
      return update ? { ...banner, priority: update.priority } : banner;
    });

    setLocalBanners(updatedLocalBanners);

    const res = await updateBannerPriorities(updates);
    if (res.success) {
      toast.success("Banner order updated");
    } else {
      toast.error("Failed to update order");
      setLocalBanners(localBanners);
    }
  };

  const topBanners = localBanners?.filter((b) => (b.position || "top") === "top") || [];
  const midBanners = localBanners?.filter((b) => b.position === "mid") || [];
  const bottomBanners = localBanners?.filter((b) => b.position === "bottom") || [];
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
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex gap-4 overflow-x-auto">
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

          {currentBanners?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 border-[#02066F] text-[#02066F] hover:bg-[#02066F] hover:text-white"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          )}
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

        {/* Preview Section - All Positions */}
        {showPreview && currentBanners?.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="text-lg font-semibold text-[#02066F] mb-4">
              📱 Homepage Preview ({activeTab === "top" ? "Top" : activeTab === "mid" ? "Mid" : "Bottom"} Section Layout)
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {activeTab === "mid" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    {currentBanners[0] && (
                      <div>
                        <img
                          src={currentBanners[0].images[0]}
                          alt={currentBanners[0].title}
                          className="w-full h-auto rounded-2xl object-cover shadow-md"
                        />
                        <div className="flex justify-between items-center mt-3">
                          <h2 className="text-xl md:text-2xl font-bold text-[#02066F]">
                            {currentBanners[0].title || "Shop Now"}
                          </h2>
                          <span className="px-4 py-2 bg-[#FFD700] text-[#02066F] font-semibold rounded-md text-sm">
                            SHOP NOW
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    {currentBanners.slice(1).map((banner) => (
                      <div key={banner._id} className="text-center">
                        <img
                          src={banner.images[0]}
                          alt={banner.title}
                          className="w-full h-[150px] md:h-[180px] rounded-2xl object-contain shadow-sm"
                        />
                        <h3 className="text-base md:text-lg font-semibold text-[#02066F] mt-2">
                          {banner.title || "Featured"}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="overflow-hidden rounded-lg">
                    {currentBanners[0] && (
                      <img
                        src={currentBanners[0].images[0]}
                        alt={currentBanners[0].title}
                        className="w-full h-[250px] md:h-[400px] object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {currentBanners.length > 1 && (
                    <div className="flex gap-2 justify-center mt-3">
                      {currentBanners.map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-[#02066F]" : "bg-gray-300"}`}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Slider view - showing banner {currentBanners.length > 1 ? "1 of " + currentBanners.length : "1"}
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              💡 Drag banners below to reorder. Preview updates automatically.
            </p>
          </div>
        )}

        {/* Uploaded Banners */}
        {currentBanners?.length ? (
          <>
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Manage Banners (Drag to reorder)
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentBanners.map((b) => b._id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentBanners.map((banner) => (
                    <SortableBannerCard
                      key={banner._id}
                      banner={banner}
                      onToggle={handleDeactivate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No banners uploaded for {activeTab} position yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
