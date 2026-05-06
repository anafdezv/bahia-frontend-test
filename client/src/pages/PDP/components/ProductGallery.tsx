import { useEffect, useMemo, useState, type MouseEvent } from "react";

import type { Product } from "@/types/product";

type ProductGalleryProps = {
  product: Product;
};

function uniqueMedia(product: Product) {
  return Array.from(
    new Set([product.mediaUrl, ...(product.otherMediaUrl ?? []), ...(product.otherMediaUrls ?? [])].filter(Boolean))
  );
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>(product.mediaUrl);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

  useEffect(() => {
    setSelectedImage(product.mediaUrl);
    setIsZoomed(false);
    setZoomOrigin("50% 50%");
  }, [product.id, product.mediaUrl]);

  const media = useMemo(() => uniqueMedia(product), [product]);
  const activeImage = selectedImage || media[0] || "";

  function handleMainImageClick() {
    setIsZoomed((previous) => !previous);
    if (isZoomed) {
      setZoomOrigin("50% 50%");
    }
  }

  function handleMainImageMove(event: MouseEvent<HTMLButtonElement>) {
    if (!isZoomed) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  return (
    <section className="w-full max-w-[720px] space-y-4 lg:flex lg:h-[calc(100svh-150px)] lg:max-h-[calc(100svh-150px)] lg:flex-col lg:overflow-hidden">
      <button
        type="button"
        className={`aspect-[3/4] w-full overflow-hidden bg-[#f0f0f0] lg:min-h-0 lg:flex-1 ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={handleMainImageClick}
        onMouseMove={handleMainImageMove}
        aria-label={isZoomed ? "Desactivar zoom de imagen" : "Activar zoom de imagen"}
      >
        <img
          src={activeImage}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-200 ${isZoomed ? "scale-[2.2]" : "scale-100"}`}
          style={{ transformOrigin: zoomOrigin }}
        />
      </button>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:flex-none">
        {media.map((mediaUrl, index) => (
          <button
            key={mediaUrl}
            type="button"
            onClick={() => {
              setSelectedImage(mediaUrl);
              setIsZoomed(false);
              setZoomOrigin("50% 50%");
            }}
            className={`aspect-square w-full overflow-hidden bg-[#f2f2f2] ${
              activeImage === mediaUrl ? "border-2 border-black" : "border border-[#e3e3e3]"
            }`}
            aria-label={`Seleccionar imagen ${index + 1} de ${media.length} de ${product.name}`}
            aria-pressed={activeImage === mediaUrl}
          >
            <img src={mediaUrl} alt={`${product.name} thumbnail`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
