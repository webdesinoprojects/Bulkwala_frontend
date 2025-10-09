import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProductStore } from "@/store/product.store";

export default function EditProductDialog({ open, onClose, slug, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    description: "",
    newImages: [], // newly selected images
  });
  const [existingImages, setExistingImages] = useState([]); // existing images URLs
  const [imagesToRemove, setImagesToRemove] = useState([]); // images marked for deletion

  const { products, editProduct } = useProductStore();

  useEffect(() => {
    if (!slug || !open) return;

    const product = Array.isArray(products)
      ? products.find((p) => p.slug === slug)
      : (products?.products || []).find((p) => p.slug === slug);

    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        newImages: [],
      });
      setExistingImages(product.images || []);
      setImagesToRemove([]);
    }
  }, [slug, open, products]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, newImages: e.target.files }));
  };

  const removeExistingImage = (index) => {
    const removed = existingImages[index];
    setImagesToRemove((prev) => [...prev, removed]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("price", formData.price);
      uploadData.append("stock", formData.stock);
      uploadData.append("description", formData.description);

      // append images to remove
      imagesToRemove.forEach((img) => uploadData.append("imagesToRemove", img));

      // append new images
      if (formData.newImages?.length > 0) {
        Array.from(formData.newImages).forEach((img) => {
          uploadData.append("images", img);
        });
      }

      // include existing images URLs to keep
      existingImages.forEach((imgUrl) => {
        uploadData.append("existingImages", imgUrl);
      });

      await editProduct(slug, uploadData);
      toast.success("Product updated successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label>Title</Label>
              <Input name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div>
              <Label>Price</Label>
              <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>

            <div>
              <Label>Stock</Label>
              <Input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md min-h-[80px]"
              />
            </div>

            {/* Previous/Current Images Preview */}
            {existingImages.length > 0 && (
              <div>
                <Label>Current Images</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img
                        src={img}
                        className="w-full h-full object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-0 right-0"
                        onClick={() => removeExistingImage(idx)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Add/Replace Images</Label>
              <Input type="file" multiple onChange={handleImageChange} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
