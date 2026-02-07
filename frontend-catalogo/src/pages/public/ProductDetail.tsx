import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productsApi } from '../../api/products';
import { Product } from '../../types';
import { ProductImageGallery } from '../../components/catalog/ProductImageGallery';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.getById(productId);
      setProduct(data);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    
    const phone = '50626431333'; // +506 2643-1333 (Jacó)
    const message = `Hola, me interesa el producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">Cargando producto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || 'Producto no encontrado'}</p>
          <Button onClick={() => navigate('/catalogo')}>
            Volver al Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/catalogo')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Catálogo
      </Button>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery - NUEVO */}
        <div>
          <ProductImageGallery
            images={product.images || []}
            productName={product.name}
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-gray-600 text-lg">
                {product.description}
              </p>
            )}
          </div>

          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Categorías
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((cat) => (
                  <Badge key={cat.id} variant="default">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Características
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Button */}
          <div className="pt-4">
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;