import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { tagsApi } from '../../api/tags';
import { providersApi } from '../../api/providers';
import { Category, Tag, Provider, ProductImage } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ExistingImagesManager } from '../../components/common/ExistingImagesManager';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

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
    provider_ids: [] as number[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  // NUEVO: Gestión de imágenes
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

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
          provider_ids: product.providers?.map((p: any) => p.id) || [],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que haya al menos una imagen
    if (!isEditing && newImages.length === 0) {
      setError('Debes agregar al menos una imagen');
      return;
    }
    
    if (isEditing && existingImages.length === 0 && newImages.length === 0) {
      setError('El producto debe tener al menos una imagen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category_ids', JSON.stringify(form.category_ids));
      formData.append('tag_ids', JSON.stringify(form.tag_ids));
      formData.append('provider_ids', JSON.stringify(form.provider_ids));

      // Agregar nuevas imágenes
      newImages.forEach((img, index) => {
        formData.append('images', img.file);
        // Enviar si es principal
        if (img.isPrimary) {
          formData.append('primary_image_index', index.toString());
        }
      });

      if (isEditing && id) {
        // Actualizar producto
        await productsApi.update(parseInt(id), formData as any);
        
        // Eliminar imágenes marcadas
        for (const imageId of deletedImageIds) {
          await productsApi.deleteImage(parseInt(id), imageId);
        }
        
        // Si hay imagen existente marcada como principal, actualizarla
        const primaryExisting = existingImages.find(img => img.is_primary);
        if (primaryExisting && newImages.length === 0) {
          await productsApi.setPrimaryImage(parseInt(id), primaryExisting.id);
        }
      } else {
        // Crear producto
        await productsApi.create(formData as any);
      }

      navigate('/admin/productos');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExistingImage = (imageId: number) => {
    setDeletedImageIds([...deletedImageIds, imageId]);
    const newExisting = existingImages.filter(img => img.id !== imageId);
    
    // Si eliminamos la principal, marcar la primera como principal
    const wasPressed = existingImages.find(img => img.id === imageId)?.is_primary;
    if (wasPressed && newExisting.length > 0) {
      newExisting[0].is_primary = true;
    }
    
    setExistingImages(newExisting);
  };

  const handleSetPrimaryExisting = (imageId: number) => {
    setExistingImages(existingImages.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })));
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/productos')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-card rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del Producto *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Ej: Cerámica Blanca 30x30"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Precio (₡) *
            </label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              placeholder="5000"
            />
          </div>
        </div>

        {/* Imágenes - NUEVO */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Imágenes</h2>
          
          {/* Imágenes Existentes (solo en edición) */}
          {isEditing && existingImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Imágenes Actuales</h3>
              <ExistingImagesManager
                images={existingImages}
                onDelete={handleDeleteExistingImage}
                onSetPrimary={handleSetPrimaryExisting}
              />
            </div>
          )}

          {/* Nuevas Imágenes */}
          <ImageUploader
            images={newImages}
            onImagesChange={setNewImages}
            maxImages={10}
          />
        </div>

        {/* Categorías y Tags */}
        <div className="bg-card rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Clasificación</h2>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categorías
            </label>
            <select
              multiple
              value={form.category_ids.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                setForm({ ...form, category_ids: selected });
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Mantén presionado Ctrl/Cmd para seleccionar múltiples
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Etiquetas
            </label>
            <select
              multiple
              value={form.tag_ids.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                setForm({ ...form, tag_ids: selected });
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Proveedores */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Proveedores
            </label>
            <select
              multiple
              value={form.provider_ids.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                setForm({ ...form, provider_ids: selected });
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            >
              {providers.map(prov => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/productos')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;