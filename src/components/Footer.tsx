import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-extrabold text-lg mb-3">
              Cart<span className="text-blue-400">Market</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The easiest way to buy and sell golf carts. Browse listings, connect
              with dealers, and find your perfect ride.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Browse</h4>
            <div className="flex flex-col gap-2">
              <Link href="/marketplace" className="text-gray-400 hover:text-white text-sm transition-colors">
                Marketplace
              </Link>
              <Link href="/dealers" className="text-gray-400 hover:text-white text-sm transition-colors">
                Dealers
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Sell</h4>
            <div className="flex flex-col gap-2">
              <Link href="/sell" className="text-gray-400 hover:text-white text-sm transition-colors">
                List Your Cart
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-white text-sm transition-colors">
                Create Account
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} CartMarket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
