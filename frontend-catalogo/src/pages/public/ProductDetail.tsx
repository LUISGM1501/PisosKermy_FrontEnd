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

  // Función para generar link de WhatsApp
  const handleWhatsAppClick = () => {
    const phoneNumber = '50626431333'; // +506 2643-1333
    const message = `Hola, me interesa el producto: ${product?.name}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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

          {/* Botones */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {/* Botón WhatsApp - Estilo igual que About */}
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-3 transition-colors shadow-md hover:shadow-lg group"
            >
              {/* WhatsApp Icon SVG - mismo que About */}
              <svg 
                className="w-5 h-5 group-hover:scale-110 transition-transform" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar por WhatsApp
            </button>

            {/* Volver al catálogo */}
            <Link to="/catalogo" className="sm:flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
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