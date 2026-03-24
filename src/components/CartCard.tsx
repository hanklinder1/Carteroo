import Link from "next/link";
import Image from "next/image";
import { GolfCart } from "@/lib/types";
import { MapPin, Zap, Fuel, Users, Heart } from "lucide-react";

interface CartCardProps {
  cart: GolfCart;
  linkPrefix?: string;
}

export default function CartCard({ cart, linkPrefix = "/marketplace" }: CartCardProps) {
  const badgeLabel =
    cart.condition === "new"
      ? "New"
      : cart.condition === "like-new"
      ? "Like New"
      : cart.condition === "good"
      ? "Good Condition"
      : "Budget Friendly";

  return (
    <Link
      href={`${linkPrefix}/${cart.id}`}
      className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-100"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {cart.images[0] ? (
          <Image
            src={cart.images[0]}
            alt={cart.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Photo</span>
          </div>
        )}
        {/* Zillow-style badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-sm bg-red-500 text-white shadow-sm">
            {badgeLabel}
          </span>
        </div>
        {/* Heart icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white">
            <Heart size={16} className="text-gray-600" />
          </div>
        </div>
        {/* Bottom gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-4">
        <p className="text-gray-900 font-bold text-xl mb-1">
          ${cart.price.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <span className="flex items-center gap-1">
            {cart.powerType === "electric" ? <Zap size={14} /> : <Fuel size={14} />}
            {cart.powerType === "electric" ? "Electric" : "Gas"}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {cart.seats} seats
          </span>
          <span className="text-gray-300">|</span>
          <span>{cart.year}</span>
        </div>
        <h3 className="text-gray-700 text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {cart.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <MapPin size={12} />
          {cart.location}
        </div>
      </div>
    </Link>
  );
}
