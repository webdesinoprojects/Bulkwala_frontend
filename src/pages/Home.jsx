import { useState } from "react";
import CategoryNav from "../components/CategoryNav.jsx";
import CategorySlider from "../components/CategorySlider.jsx";
import SubcategoryList from "../components/SubcategoryList.jsx";
import SubcategoryGrid from "@/components/SubcategoryGrid.jsx";
import PromoSection from "@/components/PromoSection.jsx";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <div className="w-full space-y-6 p-4 ">
        {/* Top Category Menu */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {/* Slider */}
        <CategorySlider category={selectedCategory} />
        {/* Subcategories */}
        <SubcategoryList category={selectedCategory} />
        {/* Subcategory grid */}
        <SubcategoryGrid />
      </div>

      {/* Sale Section */}
      <div className=" w-full h-[500px] my-10">
        <img
          src="https://ik.imagekit.io/bulkwala/demo/section-3.png?updatedAt=1759740430676"
          alt=""
          className="w-full object-cover h-full"
        />
      </div>

      {/* Promo Section */}

      <PromoSection />
    </>
  );
}
