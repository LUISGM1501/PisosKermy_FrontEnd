import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { tagsApi } from '../../api/tags';
import { providersApi } from '../../api/providers';
import { AdminProduct, Category, Tag, Provider } from '../../types';

const Products = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Filtros
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, selectedTag, selectedProvider]);

  const loadFilters = async () => {
    try {
      const [cats, tgs, provs] = await Promise.all([
        categoriesApi.getAllAdmin(),
        tagsApi.getAllAdmin(),
        providersApi.getAll(),
      ]);
      setCategories(cats);
      setTags(tgs);
      setProviders(provs);
    } catch (err) {
      console.error('Error cargando filtros:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // pasar filtros correctamente
      const filters: any = {};
      if (selectedCategory) filters.category_id = selectedCategory;
      if (selectedTag) filters.tag_id = selectedTag;
      if (selectedProvider) filters.provider_id = selectedProvider;

      const res = await productsApi.getAllAdmin(page, filters);
      setProducts(res.products);
      setTotalPages(res.pages || 1);
      setTotalProducts(res.total || 0);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    setDeleting(id);
    try {
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotalProducts((prev) => prev - 1);
    } catch {
      setError('Error al eliminar producto');
    } finally {
      setDeleting(null);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedProvider('');
    setPage(1);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Productos</h1>
          <Link
            to="/admin/productos/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <Plus size={20} />
            Nuevo Producto
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-card p-6 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-input rounded-lg"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Etiqueta */}
            <div>
              <label className="block text-sm font-medium mb-2">Etiqueta</label>
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-input rounded-lg"
              >
                <option value="">Todas las etiquetas</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Proveedor */}
            <div>
              <label className="block text-sm font-medium mb-2">Proveedor</label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-input rounded-lg"
              >
                <option value="">Todos los proveedores</option>
                {providers.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {totalProducts} producto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tabla */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay productos
          </div>
        ) : (
          <>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Imagen</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Categorías</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Etiquetas</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            Sin imagen
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </td>
                      <td className="px-6 py-4">₡{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {product.categories && product.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.tags && product.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/productos/${product.id}/edit`}
                            className="p-2 hover:bg-muted rounded"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                  Anterior
                </button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Siguiente
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Products;