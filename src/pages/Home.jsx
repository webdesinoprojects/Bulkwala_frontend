import { useState } from "react";
import CategoryNav from "../components/CategoryNav.jsx";
import CategorySlider from "../components/CategorySlider.jsx";
import SubcategoryList from "../components/SubcategoryList.jsx";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Top Category Menu */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Slider */}
      <CategorySlider category={selectedCategory} />

      {/* Subcategories */}
      <SubcategoryList category={selectedCategory} />
    </div>
  );
}
