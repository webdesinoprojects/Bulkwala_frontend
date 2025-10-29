import { useState } from "react";
import CategoryNav from "../components/CategoryNav.jsx";
import CategorySlider from "../components/CategorySlider.jsx";
import SubcategoryList from "../components/SubcategoryList.jsx";
import PromoSection from "@/components/PromoSection.jsx";
import RecentProductsCarousel from "@/components/RecentProductsCarousel.jsx";
import TopProductsCarousel from "@/components/TopProductsCarousel.jsx";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* 🔹 SLIDER */}
      <section className="max-w-7xl mx-auto px-4">
        <CategorySlider category={selectedCategory} />
      </section>

      {/* 🔹 SUBCATEGORIES (Animated + Conditional) */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <SubcategoryList category={selectedCategory} />
      </section>
      {/* 🔹 Product Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <RecentProductsCarousel />
      </section>

      {/* 🔹 PROMO SECTION */}
      <section className="max-w-7xl mx-auto ">
        <PromoSection />
      </section>

      {/* 🔹 TOP PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <TopProductsCarousel />
      </section>
    </div>
  );
}
