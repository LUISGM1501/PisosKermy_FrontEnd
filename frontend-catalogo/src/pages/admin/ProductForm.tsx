import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { tagsApi } from '../../api/tags';
import { providersApi } from '../../api/providers';
import { Category, Tag, Provider } from '../../types';

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
    image: null as File | null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

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
          image: null,
        });
        if (product.image_url) {
          setExistingImage(product.image_url);
        }
      }
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
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

    setLoading(true);

    try {
      // Crear objeto con los datos (NO FormData)
      const productData = {
        name: form.name.trim(),
        description: form.description?.trim() || '',
        price: parseFloat(form.price),
        category_ids: form.category_ids,
        tag_ids: form.tag_ids,
        provider_ids: form.provider_id ? [form.provider_id] : [],
        image: form.image || undefined,
      };

      if (isEditing && id) {
        await productsApi.update(parseInt(id), productData);
      } else {
        await productsApi.create(productData);
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

          {/* Imagen */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Imagen</label>
            
            {(imagePreview || existingImage) && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview || existingImage || ''}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer w-fit">
              <Upload className="h-4 w-4" />
              {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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