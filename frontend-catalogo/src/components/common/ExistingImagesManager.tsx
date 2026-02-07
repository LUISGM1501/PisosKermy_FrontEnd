import { Star, X } from 'lucide-react';
import { ProductImage } from '../../types';
import { Button } from '../ui/button';

interface ExistingImagesManagerProps {
  images: ProductImage[];
  onDelete: (imageId: number) => void;
  onSetPrimary: (imageId: number) => void;
}

export const ExistingImagesManager = ({
  images,
  onDelete,
  onSetPrimary,
}: ExistingImagesManagerProps) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={`relative group rounded-lg overflow-hidden border-2 ${
            image.is_primary ? 'border-yellow-400' : 'border-border'
          }`}
        >
          {/* Image */}
          <img
            src={image.image_url}
            alt="Product"
            className="w-full h-40 object-cover"
          />

          {/* Primary Badge */}
          {image.is_primary && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Principal
            </div>
          )}

          {/* Order Badge */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
            #{image.display_order + 1}
          </div>

          {/* Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {/* Set Primary */}
            {!image.is_primary && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => onSetPrimary(image.id)}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                title="Marcar como principal"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}

            {/* Remove - Solo si no es la única imagen */}
            {images.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (window.confirm('¿Eliminar esta imagen?')) {
                    onDelete(image.id);
                  }
                }}
                title="Eliminar imagen"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};