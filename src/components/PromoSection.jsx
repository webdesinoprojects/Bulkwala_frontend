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
            ? "w-full h-auto rounded-2xl object-cover shadow-md hover:shadow-lg transition-all duration-300"
            : "w-full h-[180px] md:h-[200px] rounded-2xl object-contain shadow-sm hover:shadow-md transition-all duration-300"
        }
      />

      {large ? (
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#02066F]">
            {banner.title || "Shop Now"}
          </h2>
          <Button
            onClick={handleCtaClick}
            className="bg-[#FFD700] text-[#02066F] font-semibold hover:bg-[#E5C870]"
          >
            SHOP NOW
          </Button>
        </div>
      ) : (
        <h3 className="text-lg md:text-xl font-semibold text-[#02066F] mt-2">
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

    const hasOrderingField = midOnly.some(
      (banner) =>
        typeof (banner?.priority ?? banner?.order ?? banner?.sortOrder ?? banner?.displayOrder) ===
        "number"
    );

    const sorted = hasOrderingField
      ? [...midOnly].sort((a, b) => {
          const aOrder = a?.priority ?? a?.order ?? a?.sortOrder ?? a?.displayOrder;
          const bOrder = b?.priority ?? b?.order ?? b?.sortOrder ?? b?.displayOrder;

          if (typeof aOrder === "number" && typeof bOrder === "number") {
            return aOrder - bOrder;
          }

          return 0;
        })
      : midOnly;

    const flattened = sorted
      .flatMap((banner) =>
        (Array.isArray(banner?.images) ? banner.images : []).map((image, idx) => ({
          id: `${banner?._id || banner?.id || "banner"}-${idx}`,
          image,
          title: banner?.title,
          ctaLink: banner?.ctaLink,
        }))
      )
      .filter((banner) => Boolean(banner.image))
      .slice(0, 3);

    return flattened;
  }, [banners]);

  if (usableBanners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {usableBanners[0] && <BannerCard banner={usableBanners[0]} large />}
        </div>

        <div className="flex flex-col gap-4">
          {usableBanners[1] && <BannerCard banner={usableBanners[1]} />}
          {usableBanners[2] && <BannerCard banner={usableBanners[2]} />}
        </div>
      </div>
    </section>
  );
}
