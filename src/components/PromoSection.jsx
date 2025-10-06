import React from "react";

export default function PromoSection() {
  const promos = [
    {
      id: 1,
      title: "Bulk Order Available",
      subtitle: "",
      btn: "SHOP NOW",
      img: "https://ik.imagekit.io/bulkwala/demo/deliveryhome.png?updatedAt=1759741561293",
      large: true,
    },
    {
      id: 2,
      title: "Ensure Best Quality Products",
      img: "https://ik.imagekit.io/bulkwala/demo/Earphone.png?updatedAt=1759741637848",
      bg: "",
    },
    {
      id: 3,
      title: "Trustworthy Shop by Our Client",
      img: "https://ik.imagekit.io/bulkwala/demo/bannerhome.png?updatedAt=1759741638612",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT LARGE CARD */}
        <div className="p-6 rounded-xl flex flex-col justify-between md:col-span-2 overflow-hidden  bg-[#22262F] text-white hover:shadow-lg transition">
          <div>
            <img
              src={promos[0].img}
              alt={promos[0].title}
              className="w-full h-full object-cover mb-4"
            />
          </div>
          <div className="flex align-center justify-between mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
              {promos[0].title}
            </h3>
            <button className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-400 transition">
              {promos[0].btn}
            </button>
          </div>
        </div>

        {/* RIGHT TWO SMALL CARDS */}
        <div className="flex flex-col gap-6">
          {promos.slice(1).map((item) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden p-6 h-[270px] flex items-center justify-between bg-[#112430] text-white hover:shadow-lg transition`}
            >
              <div>
                <h4 className="text-lg font-bold leading-snug max-w-[60%]">
                  {item.title}
                </h4>
              </div>
              <img
                src={item.img}
                alt={item.title}
                className="w-50 h-50 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
