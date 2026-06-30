import { useEffect } from "react";
import { useCategoryStore } from "@/store/category.store";

export default function CategoryNav({ selectedCategory, onSelect }) {
  const { categories, fetchCategories, loading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading)
    return <p className="text-center text-gray-500 py-3">Loading...</p>;

  return (
    <div
      className="
        flex 
        items-center
        gap-4 
        md:gap-5 
        overflow-x-auto 
        px-4 
        py-3 
        md:px-6 md:py-3 
        bg-white 
        border-y border-gray-100
        md:border-b md:border-t-0 md:border-gray-200
        scrollbar-hide 
        md:sticky md:top-0 md:z-30
        snap-x snap-mandatory
      "
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory?._id === cat._id;

        return (
          <div
            key={cat._id}
            className="
              flex flex-col items-center 
              min-w-[72px] 
              md:min-w-[80px] 
              cursor-pointer 
              transition-all 
              duration-200 
              active:scale-95
              snap-start
            "
            onClick={() => onSelect(cat)}
          >
            <div
              className={`
                w-14 h-14 
                md:w-16 md:h-16 
                rounded-lg 
                overflow-hidden 
                flex items-center justify-center 
                border-2 
                bg-white
                shadow-sm
                transition-all duration-200 
                ${
                  isSelected
                    ? "border-blue-600 scale-105"
                    : "border-transparent hover:border-blue-300"
                }
              `}
            >
              <img
                src={cat.img_url || cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p
              className={`
                text-[11px] md:text-sm mt-1.5 md:mt-2 
                font-medium text-center leading-tight
                ${isSelected ? "text-blue-600" : "text-gray-700"}
                truncate max-w-[72px] md:max-w-[90px]
              `}
            >
              {cat.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
