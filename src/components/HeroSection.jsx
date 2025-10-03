import React from "react";

const categories = [
  { img: "/assets/products/img1.jpg", title: "Audio Products" },
  { img: "/assets/products/img2.jpg", title: "Gaming Products" },
  { img: "/assets/products/img3.jpg", title: "Cover Products" },
  { img: "/assets/products/img4.jpg", title: "Watch Products" },
];

export default function HeroSection() {
  return (
    <section className="px-6 py-10 bg-red-300">
      <h2 className="text-3xl font-mono font-bold mb-10">Featured Products</h2>
      <div className="flex bg-blue-100 ">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative w-full max-w-[220px] h-[350px] rounded-xl overflow-hidden shadow-md group mx-auto"
          >
            {/* Full Image */}
            <img
              src={cat.img}
              alt={cat.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Bottom Overlay */}
            <div className="absolute bottom-0 w-full bg-black/90 py-2 px-3 text-center">
              <span className="font-mono text-sm font-bold text-white tracking-wide">
                {cat.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
