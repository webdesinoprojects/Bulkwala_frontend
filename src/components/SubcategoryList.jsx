import { useEffect } from "react";
import { useSubcategoryStore } from "@/store/subcategory.store";

export default function SubcategoryList({ category }) {
  const { subcategories, fetchSubcategories, loading } = useSubcategoryStore();

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  if (!category) return null;
  if (loading) return <p>Loading...</p>;

  const filtered = subcategories.filter((sub) => sub.category === category._id);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
      {filtered.map((sub) => (
        <div
          key={sub._id}
          className="p-4 border rounded-lg hover:shadow-md cursor-pointer text-center"
        >
          <img
            src={sub.image}
            alt={sub.name}
            className="w-full h-28 object-cover mb-2 rounded"
          />
          <p className="font-medium">{sub.name}</p>
        </div>
      ))}
    </div>
  );
}
