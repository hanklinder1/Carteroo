"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  const prev = () => setSelected((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setSelected((i) => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-teal-50 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Photos</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-teal-50 group">
        <Image
          src={images[selected]}
          alt={`${title} — photo ${selected + 1}`}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={selected === 0}
        />

        {/* Arrow buttons — only show if more than one image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next photo"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter pill */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {selected + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden relative transition-all ${
                i === selected
                  ? "ring-2 ring-teal-600 ring-offset-1"
                  : "opacity-60 hover:opacity-90"
              }`}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
