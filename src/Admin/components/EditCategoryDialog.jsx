import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const EditCategoryDialog = ({ open, onOpenChange, category, onSave }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewBanners, setPreviewBanners] = useState([]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setPreviewImage(category.img_url || "");
      setPreviewBanners(category.banner || []);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ name, slug, image, banner: banners });
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
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium">Current Image</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Current"
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
            <label className="block text-sm font-medium">Banners (optional)</label>
            <div className="flex flex-wrap gap-2 my-2">
              {previewBanners?.length > 0 &&
                previewBanners.map((banner, i) => (
                  <img
                    key={i}
                    src={banner}
                    alt="banner"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ))}
            </div>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setBanners([...e.target.files])}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
