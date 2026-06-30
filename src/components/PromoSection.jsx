import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useBannerStore } from "@/store/banner.store";

function BannerCard({ banner, large = false }) {
  if (!banner) return null;

  const imgSrc = banner.image || banner.imageUrl || banner.images?.[0];

  const handleCtaClick = () => {
    window.location.href = banner.ctaLink || "/products";
  };

  return (
    <div className={large ? "" : "text-center"}>
      <img
        src={imgSrc}
        alt={banner.title || "Banner"}
        className={
          large
            ? "aspect-[16/9] w-full rounded-lg bg-gray-50 object-contain shadow-md transition-all duration-300 hover:shadow-lg md:aspect-auto md:h-auto md:rounded-2xl md:object-cover"
            : "w-full h-[150px] md:h-[200px] rounded-lg md:rounded-2xl object-contain shadow-sm hover:shadow-md transition-all duration-300"
        }
      />

      {large ? (
        <div className="flex justify-between items-center gap-3 mt-3 md:mt-4">
          <h2 className="text-lg md:text-3xl font-bold text-[#02066F] line-clamp-1">
            {banner.title || "Shop Now"}
          </h2>
          <Button
            onClick={handleCtaClick}
            className="shrink-0 bg-[#FFD700] text-[#02066F] font-semibold hover:bg-[#E5C870]"
          >
            SHOP NOW
          </Button>
        </div>
      ) : (
        <h3 className="text-base md:text-xl font-semibold text-[#02066F] mt-2 line-clamp-1">
          {banner.title || "Featured"}
        </h3>
      )}
    </div>
  );
}

export default function PromoSection() {
  const { banners, fetchactiveBanners } = useBannerStore();

  useEffect(() => {
    fetchactiveBanners();
  }, [fetchactiveBanners]);

  const usableBanners = useMemo(() => {
    const rawBanners = Array.isArray(banners) ? banners : [];

    const midOnly = rawBanners.filter((banner) => banner?.position === "mid");

    const sorted = [...midOnly].sort((a, b) => (a.priority || 0) - (b.priority || 0));

    const flattened = sorted
      .flatMap((banner) =>
        (Array.isArray(banner?.images) ? banner.images : []).map((image, idx) => ({
          id: `${banner?._id || banner?.id || "banner"}-${idx}`,
          image,
          title: banner?.title,
          ctaLink: banner?.ctaLink,
        }))
      )
      .filter((banner) => Boolean(banner.image));

    return flattened;
  }, [banners]);

  if (usableBanners.length === 0) return null;

  const [firstBanner, ...restBanners] = usableBanners;

  return (
    <section className="max-w-7xl mx-auto py-4 px-4 md:py-10 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="md:col-span-2">
          {firstBanner && <BannerCard banner={firstBanner} large />}
        </div>

        <div className="flex flex-col gap-4">
          {restBanners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      </div>
    </section>
  );
}
