import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    },
    {
      id: 3,
      title: "Trustworthy Shop by Our Client",
      img: "https://ik.imagekit.io/bulkwala/demo/bannerhome.png?updatedAt=1759741638612",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-10 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT LARGE CARD */}
        <Card className="relative md:col-span-2 bg-[#22262F] text-white overflow-hidden rounded-xl hover:shadow-lg transition">
          <CardContent className="p-6 ">
            <div>
              <img
                src={promos[0].img}
                alt={promos[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl md:text-3xl font-extrabold">
                {promos[0].title}
              </CardTitle>
              <Link to="/products">
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-yellow-400"
                >
                  {promos[0].btn}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT TWO SMALL CARDS */}
        <div className="flex flex-col gap-6 ">
          {promos.slice(1).map((item) => (
            <Card
              key={item.id}
              className="relative bg-[#112430] text-white rounded-xl overflow-hidden hover:shadow-lg transition h-[270px] flex"
            >
              <CardContent className="p-6 flex items-center justify-between w-full">
                <div>
                  <CardTitle className="text-lg font-bold leading-snug max-w-[60%]">
                    {item.title}
                  </CardTitle>
                </div>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-28 h-28 object-contain"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
