import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { tagsApi } from '../../api/tags';
import { providersApi } from '../../api/providers';
import { Category, Tag, Provider, ProductImage } from '../../types';

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_ids: [] as number[],
    tag_ids: [] as number[],
    provider_id: undefined as number | undefined,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  // NUEVO: Imágenes
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [cats, tgs, provs] = await Promise.all([
        categoriesApi.getAllAdmin(),
        tagsApi.getAllAdmin(),
        providersApi.getAll(),
      ]);
      setCategories(cats);
      setTags(tgs);
      setProviders(provs);

      if (isEditing && id) {
        const product = await productsApi.getByIdAdmin(parseInt(id));
        setForm({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          category_ids: product.categories?.map((c: any) => c.id) || [],
          tag_ids: product.tags?.map((t: any) => t.id) || [],
          provider_id: product.providers[0]?.id || undefined,
        });
        
        // Cargar imágenes existentes
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
        }
      }
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  // Agregar imágenes nuevas
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImageFiles: ImageFile[] = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: newImages.length === 0 && existingImages.length === 0 && index === 0,
    }));

    setNewImages([...newImages, ...newImageFiles]);
  };

  // Eliminar imagen nueva
  const removeNewImage = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index);
    // Si eliminamos la principal y quedan imágenes, marcar la primera como principal
    if (newImages[index].isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setNewImages(updated);
  };

  // Marcar imagen nueva como principal
  const setPrimaryNew = (index: number) => {
    setNewImages(newImages.map((img, i) => ({ ...img, isPrimary: i === index })));
    // Desmarcar existentes
    setExistingImages(existingImages.map(img => ({ ...img, is_primary: false })));
  };

  // Eliminar imagen existente
  const removeExisting = async (imageId: number) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
    
    const updated = existingImages.filter(img => img.id !== imageId);
    setExistingImages(updated);
    
    // Si eliminamos la principal, marcar otra
    const wasPrimary = existingImages.find(img => img.id === imageId)?.is_primary;
    if (wasPrimary && updated.length > 0) {
      updated[0].is_primary = true;
    }
  };

  // Marcar imagen existente como principal
  const setPrimaryExisting = (imageId: number) => {
    setExistingImages(existingImages.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })));
    // Desmarcar nuevas
    setNewImages(newImages.map(img => ({ ...img, isPrimary: false })));
  };

  const toggleCategory = (catId: number) => {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter((id) => id !== catId)
        : [...prev.category_ids, catId],
    }));
  };

  const toggleTag = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (form.category_ids.length === 0) {
      setError('Selecciona al menos una categoría');
      return;
    }

    // Validar que haya al menos una imagen (nueva o existente)
    if (!isEditing && newImages.length === 0) {
      setError('Debes agregar al menos una imagen');
      return;
    }

    if (isEditing && existingImages.length === 0 && newImages.length === 0) {
      setError('El producto debe tener al menos una imagen');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('description', form.description?.trim() || '');
      formData.append('price', form.price);
      formData.append('category_ids', JSON.stringify(form.category_ids));
      formData.append('tag_ids', JSON.stringify(form.tag_ids));
      formData.append('provider_ids', JSON.stringify(form.provider_id ? [form.provider_id] : []));

      // Agregar nuevas imágenes
      newImages.forEach(img => {
        formData.append('images', img.file);
      });

      // Indicar cuál es la principal
      const primaryNewIndex = newImages.findIndex(img => img.isPrimary);
      if (primaryNewIndex >= 0) {
        formData.append('primary_image_index', primaryNewIndex.toString());
      }

      if (isEditing && id) {
        await productsApi.update(parseInt(id), formData as any);
        
        // Eliminar imágenes existentes que fueron quitadas
        const currentIds = existingImages.map(img => img.id);
        const originalProduct = await productsApi.getByIdAdmin(parseInt(id));
        const originalIds = originalProduct.images?.map((img: any) => img.id) || [];
        const deletedIds = originalIds.filter((imgId: number) => !currentIds.includes(imgId));
        
        for (const imgId of deletedIds) {
          await productsApi.deleteImage(parseInt(id), imgId);
        }
        
        // Actualizar imagen principal si es existente
        const primaryExisting = existingImages.find(img => img.is_primary);
        if (primaryExisting && newImages.length === 0) {
          await productsApi.setPrimaryImage(parseInt(id), primaryExisting.id);
        }
      } else {
        await productsApi.create(formData as any);
      }

      navigate('/admin/productos');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const allImages = [
    ...existingImages.map((img, i) => ({ ...img, isNew: false, display_order: i })),
    ...newImages.map((img, i) => ({ 
      id: -i - 1, 
      image_url: img.preview, 
      is_primary: img.isPrimary, 
      display_order: existingImages.length + i,
      isNew: true 
    }))
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/admin/productos')}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </button>

      <div className="bg-background rounded-xl border shadow-card p-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-6">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Nombre <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre del producto"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Descripción</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción del producto"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Precio (₡) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Proveedor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Proveedor</label>
            <select
              value={form.provider_id || ''}
              onChange={(e) =>
                setForm({ ...form, provider_id: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sin proveedor</option>
              {providers.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>

          {/* Categorías */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Categorías <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.category_ids.includes(cat.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Etiquetas */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.tag_ids.includes(tag.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* IMÁGENES - SIMPLIFICADO */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">
              Imágenes <span className="text-destructive">*</span>
            </label>

            {/* Grid de imágenes */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {allImages.map((img: any) => (
                  <div
                    key={img.id}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      img.is_primary ? 'border-yellow-400' : 'border-border'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    
                    {/* Badge principal */}
                    {img.is_primary && (
                      <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-current" />
                        Principal
                      </div>
                    )}

                    {/* Número */}
                    <div className="absolute top-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs">
                      #{(img.display_order ?? 0) + 1}
                    </div>

                    {/* Acciones */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => {
                            if (img.isNew) {
                              const idx = newImages.findIndex((n: ImageFile) => n.preview === img.image_url);
                              if (idx >= 0) setPrimaryNew(idx);
                            } else {
                              setPrimaryExisting(img.id);
                            }
                          }}
                          className="p-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded"
                          title="Marcar como principal"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (img.isNew) {
                            const idx = newImages.findIndex((n: ImageFile) => n.preview === img.image_url);
                            if (idx >= 0) removeNewImage(idx);
                          } else {
                            removeExisting(img.id);
                          }
                        }}
                        className="p-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded"
                        title="Eliminar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón agregar */}
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer w-fit">
              <Upload className="h-4 w-4" />
              Agregar imágenes
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/productos')}
              className="px-4 py-2 text-sm font-medium rounded-lg border text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-lg gradient-hero text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;