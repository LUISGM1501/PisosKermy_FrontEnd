import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { Shield, Truck, Award, ArrowRight, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

// IMPORTANTE: Necesitas crear esta carpeta y agregar hero-tiles.jpg ahí
// Ruta: /src/assets/hero-tiles.jpg
import heroImage from '../../assets/hero-tiles.jpg';

interface Product {
  id: number;
  name: string;
  image_url?: string | null;
  categories?: { name: string }[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productsApi.getAll({ page: 1 });
      setProducts(response.products.slice(0, 8));
    } catch (err: any) {
      setError('Error al cargar los productos destacados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Calidad Garantizada',
      description: 'Productos de las mejores marcas',
    },
    {
      icon: Truck,
      title: 'Atención Garantizada',
      description: 'Respuesta a todas tus consultas',
    },
    {
      icon: Award,
      title: '25+ Años de Experiencia',
      description: 'Décadas transformando espacios en Costa Rica',
    },
  ];

  return (
    <>
      {/* Hero Section CON IMAGEN */}
      <section className="relative min-h-[80vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl space-y-8">
            <span className="inline-block text-sm uppercase tracking-widest text-white/70 font-semibold px-4 py-1.5 bg-white/10 rounded-full">
              Nuevas colecciones 2026
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Transformamos tus espacios con estilo y calidad
            </h1>
            
            <p className="text-lg text-white/80 max-w-lg">
              Descubre nuestra colección exclusiva de pisos y revestimientos para crear ambientes únicos que reflejen tu personalidad.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={ROUTES.CATALOG}>
                <button className="bg-white text-[#B8591D] hover:bg-white/90 transition-colors px-8 py-3 rounded-lg font-semibold text-lg shadow-lg flex items-center gap-2">
                  Ver Catálogo
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex items-start gap-4"
              >
                <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#B8591D1A' }}>
                  <feature.icon className="h-6 w-6" style={{ color: '#B8591D' }} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Productos Destacados
              </h2>
              <p className="text-gray-500">
                Selección de nuestras mejores opciones
              </p>
            </div>
            <Link to={ROUTES.CATALOG} className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-[#B8591D] transition-colors">
              Ver todos
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#B8591D' }}></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Link 
                    key={product.id} 
                    to={`/producto/${product.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-300 text-4xl">📦</span>
                        </div>
                      )}
                    </div>
                    {product.categories && product.categories.length > 0 && (
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded mb-2" style={{ backgroundColor: '#B8591D1A', color: '#B8591D' }}>
                        {product.categories[0].name}
                      </span>
                    )}
                    <h3 className="font-display font-semibold group-hover:text-[#B8591D] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link to={ROUTES.CATALOG}>
                  <button className="text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
                    Ver todo el catálogo
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #B8591D 100%)' }}>
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            ¿Listo para transformar tu espacio?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Explora nuestro catálogo completo y encuentra el piso perfecto para tu proyecto. 
            Ofrecemos asesoría personalizada sin compromiso.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={ROUTES.CATALOG}>
              <button className="bg-white px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow" style={{ color: '#B8591D' }}>
                Explorar Catálogo
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;