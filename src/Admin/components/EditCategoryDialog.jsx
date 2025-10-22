import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditCategoryDialog = ({ open, onOpenChange, category, onSave }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [existingImage, setExistingImage] = useState("");
  const [existingBanners, setExistingBanners] = useState([]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setExistingImage(category.img_url || "");
      setExistingBanners(category.banner || []);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadData = new FormData();
    uploadData.append("name", name);
    uploadData.append("slug", slug);

    if (image) uploadData.append("image", image);
    existingImage && uploadData.append("existingImage", existingImage);

    banners.forEach((banner) => uploadData.append("banners", banner));

    existingBanners.forEach((bannerUrl) =>
      uploadData.append("existingBanners", bannerUrl)
    );

    await onSave(uploadData);
  };

  const handleBannerChange = (e) => {
    setBanners([...e.target.files]);
  };

  const removeBanner = (index) => {
    const newBanners = [...existingBanners];
    newBanners.splice(index, 1);
    setExistingBanners(newBanners);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium">Current Image</label>
            {existingImage && (
              <img
                src={existingImage}
                alt="Category Image"
                className="w-20 h-20 object-cover rounded-md border my-2"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Current Banners</label>
            {existingBanners.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {existingBanners.map((banner, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <img
                      src={banner}
                      alt="Banner"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-0 right-0"
                      onClick={() => removeBanner(idx)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBannerChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
