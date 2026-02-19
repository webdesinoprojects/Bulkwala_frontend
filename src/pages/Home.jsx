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
    <div>
      {/* 🔹 Category Navigation */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* 🔹 Top Banner Slider - Only show if no category selected */}
      {!selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <BannerSlider position="top" />
        </section>
      )}

      {/* 🔹 Category Slider - Only show if category is selected */}
      {selectedCategory && (
        <section className="max-w-7xl mx-auto px-4">
          <CategorySlider category={selectedCategory} defaultBanners={banners} />
        </section>
      )}

      {/* 🔹 Subcategories */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <SubcategoryList category={selectedCategory} />
      </section>

      {/* 🔹 Recent Products */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <RecentProductsCarousel />
      </section>

      {/* 🔹 Mid Banner Slider - Only show if no category selected */}
      {!selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <BannerSlider position="mid" />
        </section>
      )}

      {/* 🔹 Promo Section */}
      <section className="max-w-7xl mx-auto">
        <PromoSection />
      </section>

      {/* 🔹 Top Products */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <TopProductsCarousel />
      </section>

      {/* 🔹 Bottom Banner Slider - Only show if no category selected */}
      {!selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <BannerSlider position="bottom" />
        </section>
      )}
    </div>
  );
}
