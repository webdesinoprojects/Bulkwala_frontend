import React from "react";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Store,
  Smartphone,
  PackageCheck,
  Users,
  CalendarDays,
  MapPin,
  Globe,
  Building2 

} from "lucide-react";

export default function About() {
  const features = [
    { icon: <ShieldCheck />, title: "Trusted Quality" },
    { icon: <Truck />, title: "Pan-India Delivery" },
    { icon: <RotateCcw />, title: "Easy Returns" },
    { icon: <Headphones />, title: "Customer Support" },
  ];

  return (
    <section className="min-h-screen bg-[#f5f8fc] text-[#111827]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
   <div className="mx-auto w-full max-w-2xl">

   <div className="grid gap-4 sm:grid-cols-[1.08fr_0.92fr] sm:items-end">
     <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/70 lg:-translate-y-48">
   <img
     src="/about/premium-cases.png"
     alt="Premium mobile covers"
     className="aspect-[1.08/1] w-full object-cover"
   />
     </div>

     <div className="grid gap-4 sm:pb-6">
       <div className="rounded-3xl bg-[#C9E0EF] p-5 shadow-lg ring-1 ring-white/80 sm:p-6">
         <p className="text-4xl font-black text-[#02066F] sm:text-5xl">3000+</p>
         <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-[#02066F]/80">
           Products listed for everyday mobile needs
         </p>
       </div>

       <div className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200/70 sm:p-5">
         <div className="absolute right-4 top-4 rounded-full bg-[#02066F] px-3 py-1 text-xs font-bold text-white">
           Trending
         </div>

         <img
           src="/about/bear-case.png"
           alt="Cute phone case"
           className="mx-auto h-44 w-full object-contain sm:h-52 lg:h-56"
         />

         <p className="mt-3 text-center text-sm font-bold text-[#02066F]">
           Designer Phone Cases
         </p>
       </div>
     </div>
   </div>
 </div>

          <div className="text-center lg:text-left">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-[#02066F]/70 sm:text-base">
              About Us
            </p>
            <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight text-[#02066F] sm:text-5xl lg:mx-0 xl:text-6xl">
              Built for India’s mobile accessories market.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg lg:mx-0">
              Bulkwala.com is a digital marketplace created to make mobile accessories easier to discover and buy . From mobile covers and tempered glass to daily-use accessories, we bring reliable products closer to customers, retailers, and local sellers.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#02066F] shadow-sm">
                Since 2017
              </span>
              <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#02066F] shadow-sm">
                Delhi Based
              </span>
              <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#02066F] shadow-sm">
                Mobile Accessories
              </span>
            </div>
          </div>
        </div>

        {/* Story */}
<div className="mt-20 rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
  <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">

    {/* Left */}
    <div>
      <Store className="mb-5 h-12 w-12 text-[#02066F]" />

      <h2 className="text-3xl font-bold text-[#02066F]">
        Our Story
      </h2>

      <div className="mt-8 grid gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F7FF] p-4 transition hover:shadow-sm">
          <CalendarDays className="h-5 w-5 text-[#02066F]" />
          <div>
            <p className="font-semibold text-[#02066F]">Founded</p>
            <p className="text-sm text-gray-600">2017</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#F5F7FF] p-4 transition hover:shadow-sm">
          <MapPin className="h-5 w-5 text-[#02066F]" />
          <div>
            <p className="font-semibold text-[#02066F]">Headquartered</p>
            <p className="text-sm text-gray-600">Delhi, India</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#F5F7FF] p-4 transition hover:shadow-sm">
          <Globe className="h-5 w-5 text-[#02066F]" />
          <div>
            <p className="font-semibold text-[#02066F]">Marketplace</p>
            <p className="text-sm text-gray-600">
              Serving customers across India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#F5F7FF] p-4 transition hover:shadow-sm">
          <ShieldCheck className="h-5 w-5 text-[#02066F]" />
          <div>
            <p className="font-semibold text-[#02066F]">Core Value</p>
            <p className="text-sm text-gray-600">
              Trust & Customer Satisfaction
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Right */}
    <div className="space-y-5 text-[15px] leading-8 text-gray-600">

      <p>
        Founded in <strong className="text-[#02066F]">2017</strong> by{" "}
        <strong className="text-[#02066F]">Azad Kumar Jha</strong>,
        <strong className="text-[#02066F]"> Bulkwala.com</strong> is a proud
        initiative of Awesome Accessories, headquartered in Delhi, India.
        What started as a humble street vending journey has grown into a
        digital marketplace connecting bulk and retail shoppers across
        the country.
      </p>

      <p>
        Driven by a vision to empower local businesses, shopkeepers, and
        customers, we focus on accessibility, affordability, and trust
        while building an inclusive ecosystem where buyers and sellers can
        grow together.
      </p>

      <div className="rounded-2xl border border-[#C9E0EF] bg-[#F8FAFF] p-5">
        <p className="font-medium text-[#02066F]">
          Connecting Bharat with India through trusted digital commerce.
        </p>
      </div>

      <p>
        We believe in the spirit of innovation, resilience, and progress.
        Every challenge inspires us to learn, improve, and deliver better
        experiences to our users.
      </p>

      <p>
        At Bulkwala.com, customer satisfaction remains at the heart of
        everything we do, supported by secure payments, reliable delivery,
        and dedicated support.
      </p>

      <p>
        Whether you're shopping for fashion, home essentials, or the
        perfect gift, we're here to make every purchase simple, trusted,
        and convenient.
      </p>

    </div>
  </div>

  {/* Features */}
  <div className="mt-12 border-t border-gray-100 pt-10">
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

      {features.map((item, index) => (
        <div
          key={index}
          className="group rounded-2xl bg-[#F8FAFF] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9E0EF] text-[#02066F] transition group-hover:scale-110">
            {React.cloneElement(item.icon, { size: 22 })}
          </div>

          <h3 className="text-lg font-bold text-[#02066F]">
            {item.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {item.text}
          </p>
        </div>
      ))}

    </div>
  </div>
</div>


{/* Community Section */}
<div className="mt-20 rounded-[2rem] bg-gradient-to-br from-[#F5F9FF] to-[#bbdefb] px-8 py-14 text-center shadow-sm">
  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
    <Building2 className="h-8 w-8 text-[#02066F]" />
  </div>

  <h2 className="mt-6 text-3xl font-bold text-[#02066F]">
    Welcome to the Bulkwala Community
  </h2>

  <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-600">
    Trusted by customers, retailers, and businesses across India for quality products, secure shopping, and reliable service.
  </p>

  <div className="mt-8 flex flex-wrap justify-center gap-3">
    <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#02066F] shadow-sm">
      Trusted Shopping
    </span>

    <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#02066F] shadow-sm">
      Secure Payments
    </span>

    <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#02066F] shadow-sm">
      Fast Delivery
    </span>

    <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#02066F] shadow-sm">
      Dedicated Support
    </span>
  </div>
</div>
      </div>
    </section>
  );
}
