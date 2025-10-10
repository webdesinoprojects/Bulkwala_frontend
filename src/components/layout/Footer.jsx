import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#071422] text-white py-10 px-6 md:px-16 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-bold mb-3">BULKWALA</h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            The best quality electronics accessories <br />
            provider for the whole world.
          </p>
          <div className="flex items-center gap-3 text-gray-400">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaYoutube className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Store Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Store</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:underline cursor-pointer">Hot Accessories</li>
            <li className="hover:underline cursor-pointer">
              Audio & Headphones
            </li>
            <li className="hover:underline cursor-pointer">
              Mobile Accessories
            </li>
            <li className="hover:underline cursor-pointer">Wholesale</li>
          </ul>
        </div>

        {/* Visit Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Visit Us</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Upper Ground Floor, Back Side</li>
            <li>Building No. M-77, Block-M, Shyam Park</li>
            <li>Uttam Nagar, New Delhi - 110059</li>

            {/* Contact Us */}
            <li>📞 +91 9310701078</li>
            <li>✉️ bulkwalaindia@gmail.com</li>
          </ul>
        </div>

        {/* Legal & Policy Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Policies</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link to="/terms-and-conditions" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:underline">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-and-return-policy" className="hover:underline">
                Refund & Return Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
        <p>
          Copyright © {new Date().getFullYear()} Bulkwala.com. All rights
          reserved.
        </p>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <span className="text-gray-300">We accept:</span>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
            alt="MasterCard"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png"
            alt="Rupay"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6f/UPI_logo.svg"
            alt="UPI"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg"
            alt="Paytm"
            className="h-4"
          />
        </div>
      </div>
    </footer>
  );
}
