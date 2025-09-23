import React from "react";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

export default function HeroSection() {
  return (
    <section className="px-8 py-8 bg-white">
      <h2 className="text-2xl font-mono font-bold mb-6">Featured Products</h2>
      <div className="flex flex-col sm:flex-row gap-8 justify-center">
        <div className="rounded-xl shadow-md overflow-hidden w-full sm:w-[220px] bg-black">
          <img src={img1} alt="Audio Products" className="w-full h-[280px] object-cover" />
          <div className="bg-black/70 py-2 px-4">
            <span className="font-mono text-lg font-bold text-white">Audio Products</span>
          </div>
        </div>
        <div className="rounded-xl shadow-md overflow-hidden w-full sm:w-[220px] bg-black">
          <img src={img2} alt="Gaming Products" className="w-full h-[280px] object-cover" />
          <div className="bg-black/70 py-2 px-4">
            <span className="font-mono text-lg font-bold text-white">gaming Products</span>
          </div>
        </div>
        <div className="rounded-xl shadow-md overflow-hidden w-full sm:w-[220px] bg-black">
          <img src={img3} alt="Cover Products" className="w-full h-[280px] object-cover" />
          <div className="bg-black/70 py-2 px-4">
            <span className="font-mono text-lg font-bold text-white">Cover Products</span>
          </div>
        </div>
        <div className="rounded-xl shadow-md overflow-hidden w-full sm:w-[220px] bg-black">
          <img src={img4} alt="Watch Products" className="w-full h-[280px] object-cover" />
          <div className="bg-black/70 py-2 px-4">
            <span className="font-mono text-lg font-bold text-white">Watch Products</span>
          </div>
        </div>
      </div>
    </section>
  );
}
