import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function CategorySlider({ category }) {
  // If category is selected, use its banners, else show default slider images
  const images = category?.banner?.length
    ? category.banner
    : [
        "https://ik.imagekit.io/bulkwala/Banner/Banner.png?updatedAt=1762157575989",
        "https://ik.imagekit.io/bulkwala/Banner/Phone%20Cover%20Banner.png?updatedAt=1762157575947",
        "",
      ];

  return (
    <div className="w-full h-[350px] md:h-[650px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop={true}
        className="w-full h-full overflow-hidden rounded-lg"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`banner-${idx}`}
              className="object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
