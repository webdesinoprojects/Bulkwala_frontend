import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useState, useEffect } from 'react';
import { useBannerStore } from '@/store/banner.store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerSlider({ position = 'top' }) {
  const { banners, fetchactiveBanners, isLoading } = useBannerStore();
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    fetchactiveBanners();
  }, [fetchactiveBanners]);

  // Filter banners by position
  const positionBanners = banners?.filter((b) => (b.position || 'top') === position) || [];

  // Get all images from active banners
  const allImages = positionBanners.flatMap((banner) => 
    banner.images?.map((img) => ({
      url: img,
      title: banner.title,
      ctaLink: banner.ctaLink,
    })) || []
  );

  // Filter out failed images
  const validImages = allImages.filter((img) => !failedImages.has(img.url));

  const handleImageError = (imgUrl) => {
    setFailedImages((prev) => new Set([...prev, imgUrl]));
    if (import.meta.env.DEV) {
      console.warn(`Failed to load banner image: ${imgUrl}`);
    }
  };

  // Don't render if no valid images
  if (validImages.length === 0) {
    return null;
  }

  const handleBannerClick = (ctaLink) => {
    if (ctaLink) {
      window.location.href = ctaLink;
    }
  };

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-hidden group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          nextEl: `.banner-next-${position}`,
          prevEl: `.banner-prev-${position}`,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{ 
          delay: 4000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={validImages.length > 1}
        className="w-full overflow-hidden rounded-lg md:rounded-lg"
      >
        {validImages.map((banner, idx) => (
          <SwiperSlide key={idx} className="!h-auto">
            <div 
              className={`w-full cursor-pointer ${banner.ctaLink ? 'hover:opacity-90' : ''} transition-opacity`}
              onClick={() => handleBannerClick(banner.ctaLink)}
            >
              <img
                src={banner.url}
                alt={banner.title || `banner-${idx}`}
                onError={() => handleImageError(banner.url)}
                className="aspect-[16/9] w-full rounded-lg bg-gray-50 object-contain md:aspect-auto md:h-auto md:min-h-[350px] md:object-cover lg:min-h-[450px]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <button 
            className={`banner-prev-${position} absolute top-1/2 left-3 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 transition-all duration-300 opacity-0 group-hover:opacity-100`}
            aria-label="Previous banner"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            className={`banner-next-${position} absolute top-1/2 right-3 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 transition-all duration-300 opacity-0 group-hover:opacity-100`}
            aria-label="Next banner"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
