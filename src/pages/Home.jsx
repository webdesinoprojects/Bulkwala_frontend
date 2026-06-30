import { useState, useEffect } from "react";
import CategoryNav from "../components/CategoryNav.jsx";
import { useBannerStore } from "@/store/banner.store";
import BannerSlider from "../components/BannerSlider.jsx";
import CategorySlider from "../components/CategorySlider.jsx";
import SubcategoryList from "../components/SubcategoryList.jsx";
import PromoSection from "@/components/PromoSection.jsx";
import RecentProductsCarousel from "@/components/RecentProductsCarousel.jsx";
import TopProductsCarousel from "@/components/TopProductsCarousel.jsx";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { banners, fetchactiveBanners } = useBannerStore();

  useEffect(() => {
    fetchactiveBanners();
  }, []);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-white">
      {/* 🔹 Category Navigation */}
      <section className="w-full max-w-[100vw] mx-auto px-0 pt-3 pb-2 md:max-w-7xl md:px-4 md:py-8">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* 🔹 Top Banner Slider - Only show if no category selected */}
      {!selectedCategory && (
        <section className="w-full max-w-[100vw] mx-auto px-3 py-3 md:max-w-7xl md:px-4 md:py-4">
          <BannerSlider position="top" />
        </section>
      )}

      {/* 🔹 Category Slider - Only show if category is selected */}
      {selectedCategory && (
        <section className="w-full max-w-[100vw] mx-auto px-3 md:max-w-7xl md:px-4">
          <CategorySlider category={selectedCategory} defaultBanners={banners} />
        </section>
      )}

      {/* 🔹 Subcategories */}
      <section className="w-full max-w-[100vw] mx-auto px-0 py-3 md:max-w-7xl md:px-4 md:py-5">
        <SubcategoryList category={selectedCategory} />
      </section>

      {/* 🔹 Recent Products */}
      <section className="w-full max-w-[100vw] mx-auto px-0 py-3 md:max-w-7xl md:px-4 md:py-5">
        <RecentProductsCarousel />
      </section>

      {/* 🔹 Promo Section (Mid Banners) */}
      <section className="w-full max-w-[100vw] mx-auto md:max-w-7xl">
        <PromoSection />
      </section>

      {/* 🔹 Top Products */}
      <section className="w-full max-w-[100vw] mx-auto px-0 py-3 md:max-w-7xl md:px-4 md:py-5">
        <TopProductsCarousel />
      </section>

      {/* 🔹 Bottom Banner Slider - Only show if no category selected */}
      {!selectedCategory && (
        <section className="w-full max-w-[100vw] mx-auto px-3 py-3 md:max-w-7xl md:px-4 md:py-4">
          <BannerSlider position="bottom" />
        </section>
      )}
    </div>
  );
}
