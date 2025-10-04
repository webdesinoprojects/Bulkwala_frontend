import { useEffect } from "react";
import { useCategoryStore } from "@/store/category.store";

export default function CategoryNav({ selectedCategory, onSelect }) {
  const { categories, fetchCategories, loading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex gap-6 overflow-x-auto py-4 border-b bg-white">
      <button
        className={`px-4 py-2 rounded ${
          !selectedCategory ? "bg-blue-600 text-white" : "bg-gray-100"
        }`}
        onClick={() => onSelect(null)}
      >
        Home
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`px-4 py-2 rounded whitespace-nowrap ${
            selectedCategory?._id === cat._id
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
          onClick={() => onSelect(cat)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
