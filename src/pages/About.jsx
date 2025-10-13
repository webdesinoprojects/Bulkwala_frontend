import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building2, Globe, Users, Truck, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#02066F] to-[#243b6b] text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/white-wall.png')]"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            About <span className="text-[#C9E0EF]">BulkWala</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            India’s trusted destination for bulk products — delivering quality,
            value, and speed for every business and customer.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Who We Are */}
        <Card className="border-gray-200 shadow-md mb-16">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-[#02066F]">
              Who We Are
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 leading-relaxed space-y-4 text-lg">
            <p>
              <strong>BulkWala</strong> is a modern B2B & B2C platform built to
              simplify bulk purchasing for Indian businesses, resellers, and
              individuals. From mobile accessories to electronic essentials, we
              offer verified products sourced from trusted manufacturers.
            </p>
            <p>
              With a focus on transparency, speed, and reliability, BulkWala has
              become a one-stop solution for those looking to grow their
              business with quality products and consistent supply.
            </p>
          </CardContent>
        </Card>

        {/* Mission - Vision - Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Globe className="w-10 h-10 mx-auto text-[#02066F]" />,
              title: "Our Mission",
              desc: "To empower resellers and businesses by providing genuine products, smooth delivery, and dependable customer support across India.",
            },
            {
              icon: <Building2 className="w-10 h-10 mx-auto text-[#02066F]" />,
              title: "Our Vision",
              desc: "To become India’s most reliable and affordable wholesale platform — connecting brands, sellers, and customers under one ecosystem.",
            },
            {
              icon: <Users className="w-10 h-10 mx-auto text-[#02066F]" />,
              title: "Our Values",
              desc: "Integrity, transparency, and customer satisfaction define how we operate and the promises we keep every day.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="text-center shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200"
            >
              <CardHeader>
                {item.icon}
                <CardTitle className="mt-4 text-xl font-semibold text-[#02066F]">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-sm px-6 pb-8 leading-relaxed">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <Card className="shadow-md border-gray-200 mb-20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-[#02066F]">
              Why Choose BulkWala?
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Experience reliability, speed, and value — all in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-6">
            {[
              "Fast and reliable pan-India delivery.",
              "Affordable pricing with genuine wholesale rates.",
              "Wide range of product categories and brands.",
              "Trusted by resellers and businesses nationwide.",
              "User-friendly platform with secure payments.",
              "Dedicated customer support team for every query.",
            ].map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all"
              >
                <CheckCircle className="text-green-500 w-5 h-5 mt-0.5" />
                <p className="text-gray-700 text-sm">{point}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Closing Section */}
        <div className="text-center py-10">
          <Truck className="w-14 h-14 text-[#02066F] mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-[#02066F] mb-2">
            Together, Let’s Grow with BulkWala 🚀
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you're a reseller, entrepreneur, or business owner, BulkWala
            is here to help you scale your business with quality, affordability,
            and trust.
          </p>
        </div>
      </div>
    </section>
  );
}
