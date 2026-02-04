import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { categoriesApi } from '../../api/categories';
import { Category }      from '../../types';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Category | null>(null);
  const [name, setName]             = useState('');
  const [saving, setSaving]         = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await categoriesApi.getAllAdmin());
    } catch {
      setError('Error al cargar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  // --- modal helpers ---
  const openCreate = () => {
    setEditing(null);
    setName('');
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setModalError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) { setModalError('El nombre es obligatorio'); return; }
    setSaving(true);
    setModalError(null);
    try {
      if (editing) {
        const updated = await categoriesApi.update(editing.id, { name: name.trim() });
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
      } else {
        const created = await categoriesApi.create({ name: name.trim() });
        setCategories((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err: any) {
      setModalError(err?.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta categoria?')) return;
    try {
      await categoriesApi.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Error al eliminar categoria');
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Categorias</h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 gradient-hero text-white text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoria
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-background rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nombre</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">Cargando...</td></tr>
                )}
                {!loading && categories.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">No hay categorias</td></tr>
                )}
                {!loading && categories.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{cat.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{cat.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---- Modal ---- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* Panel */}
          <div className="relative bg-background rounded-xl shadow-elevated border w-full max-w-md p-6">
            {/* Close */}
            <button onClick={closeModal} className="absolute top-3 right-3 p-1 rounded hover:bg-muted">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              {editing ? 'Editar categoria' : 'Nueva categoria'}
            </h2>

            {modalError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-3">
                <p className="text-destructive text-sm">{modalError}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-sm font-medium text-foreground">Nombre</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Porcelanato"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium rounded-lg border text-foreground hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium rounded-lg gradient-hero text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;