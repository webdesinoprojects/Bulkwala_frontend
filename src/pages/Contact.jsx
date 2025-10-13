import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#02066F]">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            We’d love to hear from you! Reach out for any queries or support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <Card className="shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-[#02066F]">
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Your message has been sent!");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    required
                    className="focus:ring-2 focus:ring-[#02066F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="focus:ring-2 focus:ring-[#02066F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <Textarea
                    placeholder="Write your message..."
                    rows={5}
                    required
                    className="focus:ring-2 focus:ring-[#02066F]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#02066F] hover:bg-[#03108f] text-white font-medium py-2"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <div className="space-y-6">
            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-[#02066F]">
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
                  <p className="text-base font-medium">
                    bulkwalaindia@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <MapPin className="text-[#02066F] w-5 h-5" />
                <CardTitle className="text-xl text-[#02066F]">
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">
                <p>
                  <strong>Floor No.:</strong> Upper Ground Floor, Back Side
                  <br />
                  <strong>Building No./Flat No.:</strong> M-77
                  <br />
                  <strong>Road/Street:</strong> Block -M, Shyam Park
                  <br />
                  <strong>Locality:</strong> Uttam Nagar
                  <br />
                  <strong>City:</strong> New Delhi
                  <br />
                  <strong>District:</strong> West Delhi
                  <br />
                  <strong>State:</strong> Delhi
                  <br />
                  <strong>PIN Code:</strong> 110059
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Optional Map */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-[#02066F] mb-4">
            Find Us on Map
          </h2>
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md border border-gray-200">
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
