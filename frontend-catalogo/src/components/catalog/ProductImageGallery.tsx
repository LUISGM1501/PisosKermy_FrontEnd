import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ProductImage } from '../../types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-muted rounded-lg flex items-center justify-center h-96">
        <p className="text-muted-foreground">Sin imagen</p>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Main Image */}
      <div className="space-y-4">
        <div className="relative group">
          <img
            src={currentImage.image_url}
            alt={productName}
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-primary ring-2 ring-primary/50'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={image.image_url}
                  alt={`${productName} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Image */}
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <img
              src={currentImage.image_url}
              alt={productName}
              className="max-h-full max-w-full object-contain"
            />

            {/* Navigation in Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};