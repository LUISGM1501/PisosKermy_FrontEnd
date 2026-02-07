import { useEffect, useState } from 'react';
import { ProductFilters } from '../../components/catalog/ProductFilters';
import { ProductGrid } from '../../components/catalog/ProductGrid';
import { Pagination } from '../../components/common/Pagination';
import { Alert } from '../../components/ui/alert';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { tagsApi } from '../../api/tags';
import { Product, Category, Tag } from '../../types';
import { usePagination } from '../../hooks/usePagination';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');  // NUEVO
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const { currentPage, goToPage, reset } = usePagination();

  useEffect(() => {
    loadFiltersData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, selectedTag, searchQuery]);  // NUEVO: searchQuery

  const loadFiltersData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        categoriesApi.getAll(),
        tagsApi.getAll(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (err) {
      console.error('Error al cargar filtros:', err);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await productsApi.getAll({
        page: currentPage,
        category_id: selectedCategory || undefined,
        tag_id: selectedTag || undefined,
        search: searchQuery || undefined,  // NUEVO
      });

      setProducts(response.products);
      setTotalPages(response.total_pages);
      setTotalProducts(response.total);
    } catch (err: any) {
      setError('Error al cargar los productos. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    reset();
  };

  const handleTagChange = (tagId: number | null) => {
    setSelectedTag(tagId);
    reset();
  };

  // NUEVO
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    reset();  // Volver a página 1 al buscar
  };

  // ACTUALIZADO: Limpiar también búsqueda
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery('');  // NUEVO
    reset();
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        <ProductFilters
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          searchQuery={searchQuery}  // NUEVO
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
          onSearchChange={handleSearchChange}  // NUEVO
          onClearFilters={handleClearFilters}
        />

        <ProductGrid products={products} isLoading={isLoading} />

        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>
    </>
  );
};

export default Catalog;