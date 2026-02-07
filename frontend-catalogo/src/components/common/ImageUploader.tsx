import { useState } from 'react';
import { Upload, X, Star } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({ images, onImagesChange, maxImages = 10 }: ImageUploaderProps) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Verificar límite
    if (images.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }
    
    // Crear previews
    const newImages: ImageFile[] = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0, // Primera es principal
    }));
    
    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // Si eliminamos la principal, marcar la primera como principal
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    // Limpiar preview URL
    URL.revokeObjectURL(images[index].preview);
    
    onImagesChange(newImages);
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Imágenes del Producto
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click para seleccionar imágenes
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP hasta 5MB ({images.length}/{maxImages})
            </p>
          </div>
        </label>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" /> = Imagen principal
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  image.isPrimary ? 'border-yellow-400' : 'border-border'
                }`}
              >
                {/* Image Preview */}
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-40 object-cover"
                />

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Principal
                  </div>
                )}

                {/* Order Badge */}
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                  #{index + 1}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Set Primary */}
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimary(index)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Move Left */}
                  {index > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => moveImage(index, index - 1)}
                    >
                      ←
                    </Button>
                  )}

                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => moveImage(index, index + 1)}
                    >
                      →
                    </Button>
                  )}

                  {/* Remove */}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};