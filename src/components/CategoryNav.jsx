import { useEffect } from "react";
import { useCategoryStore } from "@/store/category.store";

export default function CategoryNav({ selectedCategory, onSelect }) {
  const { categories, fetchCategories, loading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex gap-4 overflow-x-auto py-2 border-b scrollbar-hide">
      {categories.map((cat) => {
        const isSelected = selectedCategory?._id === cat._id;

        return (
          <div
            key={cat._id}
            className="flex flex-col items-center min-w-[70px] cursor-pointer"
            onClick={() => onSelect(cat)}
          >
            <div
              className={`w-16 h-16 rounded overflow-hidden flex items-center justify-center border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-600 scale-105"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              <img
                src={cat.img_url || cat.image}
                alt={cat.name}
                className="w-full h-full object-cover "
              />
            </div>
            <p
              className={`text-sm mt-2 font-medium ${
                isSelected ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {cat.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
