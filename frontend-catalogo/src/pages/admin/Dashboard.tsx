import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Truck, ClipboardList } from 'lucide-react';
import { categoriesApi } from '../../api/categories';
import { tagsApi } from '../../api/tags';
import { providersApi } from '../../api/providers';
import { productsApi } from '../../api/products';

interface StatCard {
  title: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  href: string;
  color: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Record<string, number>>({
    products: 0,
    categories: 0,
    tags: 0,
    providers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [products, categories, tags, providers] = await Promise.all([
          productsApi.getAllAdmin(1),
          categoriesApi.getAllAdmin(),
          tagsApi.getAllAdmin(),
          providersApi.getAll(),
        ]);
        setStats({
          products: products.total,
          categories: categories.length,
          tags: tags.length,
          providers: providers.length,
        });
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const cards: StatCard[] = [
    { title: 'Productos', value: stats.products, icon: Package, href: '/admin/productos', color: 'bg-primary/10' },
    { title: 'Categorías', value: stats.categories, icon: Tag, href: '/admin/categorias', color: 'bg-accent/10' },
    { title: 'Proveedores', value: stats.providers, icon: Truck, href: '/admin/proveedores', color: 'bg-success/10' },
    { title: 'Etiquetas', value: stats.tags, icon: Tag, href: '/admin/etiquetas', color: 'bg-warning/10' },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                to={card.href}
                className="group bg-background rounded-xl border shadow-card p-5 hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-foreground">
                      {loading ? '...' : card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-4">
          <Link
            to="/admin/bitacora"
            className="group bg-background rounded-xl border shadow-card p-6 hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <ClipboardList className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ver bitácora de auditoría</h3>
                <p className="text-sm text-muted-foreground">Revisa las acciones administrativas</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;