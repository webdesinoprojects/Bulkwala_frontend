import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryStore } from "@/store/query.store.js";
import { contactSchema } from "@/schemas/contact.Schema.js";
import { toast } from "sonner";

export default function Contact() {
  const { createQuery, loading, error } = useQueryStore();

  // React Hook Form methods and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    const result = await createQuery(data);
    if (result.success) {
      toast.success("✅ Your query has been sent!");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
<div className="relative mb-16 overflow-hidden bg-[#071B4D] py-24 text-white">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-60"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80')",
    }}
  />

  {/* Light Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#02066F]/75 via-[#0B4EA2]/50 to-[#38BDF8]/25" />

  {/* Glow */}
  <div className="absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl" />

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
    <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-sky-200">
      Contact Us
    </p>

    <h1 className="text-4xl font-black tracking-tight md:text-6xl">
      Need help with your order?
    </h1>

    <div className="mx-auto my-5 h-1 w-20 rounded-full bg-sky-300" />

    <p className="mx-auto max-w-2xl text-base leading-7 text-white/90 md:text-lg">
      Our team is here for support, product inquiries, partnerships, and seller
      assistance. Send us a message and we'll get back to you shortly.
    </p>
  </div>

  {/* Convex Curved Bottom */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
    <svg
      viewBox="0 0 1440 120"
      className="relative block w-full h-[100px]"
      preserveAspectRatio="none"
    >
      <path
        fill="#f8fafc"
        d="M0,40 C360,140 1080,140 1440,40 L1440,120 L0,120 Z"
      />
    </svg>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 mb-16">
        {/* Contact Form */}
        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="text-2xl text-[#02066F]">
              Get in Touch
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill out the form below and we’ll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")} // Hook Form registration
                  className="focus:ring-2 focus:ring-[#02066F]"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="focus:ring-2 focus:ring-[#02066F]"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <Textarea
                  placeholder="Write your message..."
                  rows={5}
                  {...register("message")}
                  className="focus:ring-2 focus:ring-[#02066F]"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#02066F] hover:bg-[#03108f] text-white font-medium py-2 flex items-center justify-center gap-2"
                disabled={loading} // Disable the button while loading
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="shadow-lg border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-[#02066F]">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <Phone className="text-[#02066F]" />
                <p className="text-base font-medium">9310701078</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[#02066F]" />
                <p className="text-base font-medium">bulkwalaindia@gmail.com</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200">
            <CardHeader className="flex items-center gap-2">
              <MapPin className="text-[#02066F] w-6 h-6" />
              <CardTitle className="text-2xl text-[#02066F]">
                Office Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-1">
              <p>
                <strong>Floor No.:</strong> Upper Ground Floor, Back Side
              </p>
              <p>
                <strong>Building No./Flat No.:</strong> M-77
              </p>
              <p>
                <strong>Road/Street:</strong> Block -M, Shyam Park
              </p>
              <p>
                <strong>Locality:</strong> Uttam Nagar
              </p>
              <p>
                <strong>City:</strong> New Delhi
              </p>
              <p>
                <strong>District:</strong> West Delhi
              </p>
              <p>
                <strong>State:</strong> Delhi
              </p>
              <p>
                <strong>PIN Code:</strong> 110059
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-[#02066F] mb-6">
            Find Us on the Map
          </h2>
          <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-md border border-gray-200">
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=M-77,+Block+M,+Shyam+Park,+Uttam+Nagar,+Delhi+110059&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
