import React, { useEffect } from "react";
import { useProductStore } from "@/store/product.store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function RecentProductsCarousel() {
  const { products, fetchProducts, loading, error } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({ limit: 10, sort: "-createdAt" });
  }, [fetchProducts]);

  if (loading)
    return (
      <div className="flex justify-center py-16 text-gray-500 text-lg">
        Loading latest products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-16 text-red-500">
        Failed to load products.
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="flex justify-center py-16 text-gray-500 text-lg">
        No products found.
      </div>
    );

  return (
    <section className="relative max-w-7xl mx-auto px-4 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Newly Launched Products
        </h2>
        <div className="h-[2px] w-24 bg-[#02066F]" />
      </div>

      {/* Carousel */}
      <div className="relative overflow-visible">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 5 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          className="pb-12 custom-swiper"
        >
          {products.slice(0, 10).map((product) => (
            <SwiperSlide key={product._id}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col h-[340px]">
                {/* Image Section */}
                <div
                  className="relative w-full h-[170px] bg-gray-50 overflow-hidden flex items-center justify-center"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  <img
                    src={
                      product.images?.[0] ||
                      "https://ik.imagekit.io/bulkwala/demo/default-product.png"
                    }
                    alt={product.title}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description?.slice(0, 60) || "No description"}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-[#02066F]">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      View Details ›
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
