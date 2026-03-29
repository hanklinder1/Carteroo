import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/images/golf-cart.png"
                alt="Carteroo logo"
                width={24}
                height={24}
                className="object-contain brightness-0 invert"
              />
              <h3 className="text-white font-extrabold text-lg">
                Carter<span className="text-teal-400">oo</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The easiest way to buy and sell golf carts. Browse listings, connect
              with dealers, and find your perfect ride.
            </p>
            <div className="flex flex-col gap-2 text-gray-500 text-xs">
              <span className="flex items-center gap-2">
                <Mail size={13} className="text-teal-500" />
                marketplace@carteroo.com
              </span>
              <span className="flex items-center gap-2">
                <Phone size={13} className="text-teal-500" />
                (800) 555-CART
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={13} className="text-teal-500" />
                United States
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Browse</h4>
            <div className="flex flex-col gap-2">
              <Link href="/marketplace" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Marketplace
              </Link>
              <Link href="/dealers" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Dealers
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Sell</h4>
            <div className="flex flex-col gap-2">
              <Link href="/sell" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                List Your Cart
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Create Account
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                About
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Sign In
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Carteroo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
