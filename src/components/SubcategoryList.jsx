import { useEffect } from "react";
import { useSubcategoryStore } from "@/store/subcategory.store";

export default function SubcategoryList({ category }) {
  const { subcategories, fetchSubcategories, loading } = useSubcategoryStore();

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  if (!category) return null;
  if (loading) return <p>Loading...</p>;

  // ✅ Fix: handle object-based category
  const filtered = subcategories.filter((sub) => {
    // sub.category could be an object or ID depending on backend
    return sub.category?._id === category._id || sub.category === category._id;
  });

  console.log("Filtered Subcategories:", filtered);

  if (filtered.length === 0)
    return (
      <p className="mt-6 text-gray-500 text-center">No subcategories found</p>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
      {filtered.map((sub) => (
        <div
          key={sub._id}
          className="p-4 border rounded-lg hover:shadow-md cursor-pointer text-center bg-white"
        >
          <img
            src={sub.img_url || sub.image}
            alt={sub.name}
            className="w-full h-full object-cover mb-2 rounded"
          />
          <p className="font-medium">{sub.name}</p>
        </div>
      ))}
    </div>
  );
}
