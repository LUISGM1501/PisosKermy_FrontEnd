import { useState, useEffect } from "react";
import { Category, Tag } from "../../types";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Filter, X, Search } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: number | null;
  selectedTag: number | null;
  searchQuery: string;
  onCategoryChange: (categoryId: number | null) => void;
  onTagChange: (tagId: number | null) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

export const ProductFilters = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  searchQuery,
  onCategoryChange,
  onTagChange,
  onSearchChange,
  onClearFilters,
}: ProductFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const hasFilters = selectedCategory !== null || selectedTag !== null || searchQuery !== '';

  // Debounce: Espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Sincronizar con prop cuando se limpian filtros
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="bg-card rounded-lg border shadow-card p-6">
      {/* Título */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold text-lg">Filtros</h2>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5 mr-1.5" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Búsqueda por nombre */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Buscar producto
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Ej: Cerámica, Porcelanato..."
            className={cn(
              "w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              searchQuery !== '' && "border-primary/50 bg-primary/5"
            )}
          />
        </div>
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Categoría
        </label>
        <select
          value={selectedCategory?.toString() || ""}
          onChange={(e) => {
            const value = e.target.value;
            onCategoryChange(value ? parseInt(value) : null);
          }}
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
            selectedCategory !== null && "border-primary/50 bg-primary/5"
          )}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Etiqueta */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Etiqueta
        </label>
        <select
          value={selectedTag?.toString() || ""}
          onChange={(e) => {
            const value = e.target.value;
            onTagChange(value ? parseInt(value) : null);
          }}
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
            selectedTag !== null && "border-primary/50 bg-primary/5"
          )}
        >
          <option value="">Todas las etiquetas</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id.toString()}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Resumen activos */}
      {hasFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {[
              searchQuery && `Búsqueda: "${searchQuery}"`,
              selectedCategory && categories.find((c) => c.id === selectedCategory)?.name,
              selectedTag && tags.find((t) => t.id === selectedTag)?.name,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
};