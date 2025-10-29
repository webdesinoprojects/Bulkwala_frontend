import { useEffect, useMemo } from "react";
import { useSubcategoryStore } from "@/store/subcategory.store";
import { useNavigate } from "react-router-dom";

export default function SubcategoryList({ category }) {
  const { subcategories, fetchSubcategories, loading } = useSubcategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  // ✅ Filter logic — show all or by selected category
  const filteredSubcategories = useMemo(() => {
    if (!category) return subcategories;
    return subcategories.filter(
      (sub) =>
        sub.category?._id === category._id || sub.category === category._id
    );
  }, [subcategories, category]);

  // ✅ Loading State
  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-500 text-lg">
        Loading subcategories...
      </div>
    );

  // ✅ No Subcategories Found
  if (!filteredSubcategories || filteredSubcategories.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {category ? `Explore ${category.name}` : "Explore by Subcategories"}
          </h2>
          <div className="h-[2px] w-24 bg-[#02066F]" />
        </div>
        <p className="text-gray-500 text-center">
          {category
            ? "No subcategories found for this category."
            : "No subcategories available right now."}
        </p>
      </div>
    );

  // ✅ Subcategory List
  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {category ? `Explore ${category.name}` : "Explore by Subcategories"}
        </h2>
        <div className="h-[2px] w-24 bg-[#02066F]" />
      </div>

      {/* Subcategory Grid / Scroll */}
      <div className="flex gap-6 overflow-x-auto py-1 scrollbar-hide">
        {filteredSubcategories.map((sub) => (
          <div
            key={sub._id}
            onClick={() =>
              navigate(`/products?subcategory=${encodeURIComponent(sub.name)}`)
            }
            className="flex flex-col items-center min-w-[70px] sm:min-w-[90px] cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-20 sm:h-20 rounded overflow-hidden flex items-center justify-center border-2 transition-all duration-300 border-transparent group-hover:border-[#02066F] hover:scale-105 bg-white shadow-sm">
              <img
                src={sub.img_url || sub.image}
                alt={sub.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm mt-2 font-medium text-gray-700 group-hover:text-[#02066F] transition-colors text-center">
              {sub.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
