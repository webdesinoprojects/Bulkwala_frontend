import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CategorySlider({ category }) {
  const images = category?.banner?.length
    ? category.banner
    : [
        "https://ik.imagekit.io/bulkwala/Banner/Banner.png?updatedAt=1762157575989",
        "https://ik.imagekit.io/bulkwala/Banner/Phone%20Cover%20Banner.png?updatedAt=1762157575947",
        "https://ik.imagekit.io/bulkwala/Banner/Accessories.png?updatedAt=1762157575989",
      ];

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full rounded-lg overflow-hidden"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`banner-${idx}`}
              className="
    w-full 
    h-auto 
    max-h-[180px] sm:max-h-[250px] md:max-h-[400px] lg:max-h-[500px] xl:max-h-[550px]
    object-contain 
    rounded-lg
  "
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Custom Arrows — clean & centered */}
      <button
        className="
          custom-prev absolute top-1/2 left-3 -translate-y-1/2 
          z-20 w-10 h-10 md:w-12 md:h-12 
          bg-white/90 hover:bg-white 
          rounded-full shadow-md 
          flex items-center justify-center 
          text-2xl md:text-3xl font-extrabold text-black 
          transition-all duration-300
        "
      >
        ‹
      </button>

      <button
        className="
          custom-next absolute top-1/2 right-3 -translate-y-1/2 
          z-20 w-10 h-10 md:w-12 md:h-12 
          bg-white/90 hover:bg-white 
          rounded-full shadow-md 
          flex items-center justify-center 
          text-2xl md:text-3xl font-extrabold text-black 
          transition-all duration-300
        "
      >
        ›
      </button>
    </div>
  );
}
