import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, PackageOpen } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { productsApi } from '../../api/products';
import { Product } from '../../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getById(Number(id));
        setProduct(data);
      } catch (err: any) {
        setError(
          err?.response?.status === 404
            ? 'Producto no encontrado'
            : 'Error al cargar el producto'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- loading ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // --- error ---
  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 mb-6">
          <p className="text-destructive font-medium">{error || 'Producto no encontrado'}</p>
        </div>
        <Link to="/catalogo">
          <Button variant="default">Volver al Catálogo</Button>
        </Link>
      </div>
    );
  }

  const hasImage = product.image_url && !imgError;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      {/* Back button (visible en mobile, oculto en desktop) */}
      <Link to="/catalogo" className="inline-flex sm:hidden items-center gap-1 text-sm text-primary hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* Imagen */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-card">
          {hasImage ? (
            <img
              src={product.image_url || undefined}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PackageOpen className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-4">

          {/* Categorías */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <Badge key={cat.id} variant="category">{cat.name}</Badge>
              ))}
            </div>
          )}

          {/* Nombre */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Descripción */}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed text-base">
              {product.description}
            </p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <Badge key={tag.id} variant="tag">{tag.name}</Badge>
              ))}
            </div>
          )}

          {/* Volver al catálogo (desktop) */}
          <div className="pt-4">
            <Link to="/catalogo">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;