import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import { Product } from "../../types";
import { getImageUrl, truncateText } from "../../utils/formatters";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.image_url && !imgError;

  return (
    <Link
      to={`/producto/${product.id}`}
      className="block animate-fade-in"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <Card variant="product" className="h-full flex flex-col">
        {/* Imagen */}
        <div className="aspect-square overflow-hidden bg-muted">
          {hasImage ? (
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PackageOpen className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <h3 className="font-display font-semibold text-lg leading-tight text-foreground">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {truncateText(product.description, 90)}
          </p>

          {/* Categorías */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.categories.map((category) => (
                <Badge key={category.id} variant="category">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag.id} variant="tag">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-2 border-t border-border">
            <span className="text-sm font-medium text-primary transition-colors group-hover:text-accent">
              Ver detalles →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};