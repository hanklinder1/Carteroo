import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Carteroo — Florida's easiest way to buy and sell golf carts.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About Carteroo</h1>
      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <p>
          Carteroo is the simplest way to buy and sell golf carts online. We
          connect private sellers, dealers, and buyers in one easy-to-use
          marketplace.
        </p>
        <p>
          Whether you&apos;re looking for a budget-friendly ride around the
          neighborhood, a street-legal commuter, or a fully custom luxury cart,
          Carteroo makes it easy to find exactly what you need.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 pt-4">Our Mission</h2>
        <p>
          The golf cart market has exploded in recent years, but buying and
          selling carts is still harder than it should be. Listings are scattered
          across Facebook groups, Craigslist, and dealer websites with no way to
          compare.
        </p>
        <p>
          Carteroo brings everything together — verified dealers, private
          sellers, detailed specs, and easy communication — so you can shop with
          confidence.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 pt-4">For Sellers</h2>
        <p>
          Create a free listing in minutes. Add photos, specs, and a description,
          and your cart is instantly visible to thousands of local buyers. Dealers
          can create a storefront to showcase their full inventory.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 pt-4">For Buyers</h2>
        <p>
          Browse listings with powerful filters. Compare carts side by side. Read
          dealer reviews. Message sellers directly. Carteroo gives you
          everything you need to find your perfect cart.
        </p>
      </div>
    </div>
  );
}
