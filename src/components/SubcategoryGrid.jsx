import React from "react";

export default function SubcategoryGrid() {
  const demoData = [
    {
      title: "AUDIO && HEADPHONE",
      offer: "Up to 15% Off",
      img: "https://ik.imagekit.io/bulkwala/demo/headphones.png?updatedAt=1759738589143",
    },
    {
      title: "MOBILE ACCESSORIES",
      offer: "Up to 15% Off",
      img: "https://ik.imagekit.io/bulkwala/demo/mobile-accessories.png?updatedAt=1759738594058",
    },
    {
      title: "PUBG Accessories",
      offer: "Up to 15% Off",
      img: "https://ik.imagekit.io/bulkwala/demo/pubg-accessories.png?updatedAt=1759738593308",
    },
    {
      title: "HOT ACCESSORIES",
      offer: "Up to 15% Off",
      img: "https://ik.imagekit.io/bulkwala/demo/hot-accessories.png?updatedAt=1759738593694",
    },
    {
      title: "Wearable Accessories",
      offer: "Up to 15% Off",
      img: "https://ik.imagekit.io/bulkwala/demo/wearable.png?updatedAt=1759738593890",
    },
    {
      title: "Power & Cables Accessories",
      offer: "Up to 15% Off",
      img: "https://ik.imagekit.io/bulkwala/demo/cables.png?updatedAt=1759738588518",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-6">Electronic Accessories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {demoData.map((item, index) => (
          <div
            key={index}
            className="relative bg-[#112430] rounded-xl text-white p-5 h-62 flex flex-col justify-between overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div>
              <h3 className="text-4xl font-bold uppercase font-Reddit Mono ">
                {item.title}
              </h3>
              <p className="text-gray-300 text-lg mt-4">{item.offer}</p>
              <button className="mt-15 text-s font-semibold text-yellow-400 flex items-center gap-2">
                <span>›</span> SHOP NOW
              </button>
            </div>

            <img
              src={item.img}
              alt={item.title}
              className="absolute bottom-0 right-0 w-[180px] h-[180px] object-cover transform translate-x-4 translate-y-2"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
