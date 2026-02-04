import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { tagsApi } from '../../api/tags';
import { Tag }    from '../../types';

const Tags = () => {
  const [tags, setTags]           = useState<Tag[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Tag | null>(null);
  const [name, setName]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      setTags(await tagsApi.getAllAdmin());
    } catch {
      setError('Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setName(''); setModalError(null); setModalOpen(true); };
  const openEdit   = (t: Tag) => { setEditing(t); setName(t.name); setModalError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalError(null); };

  const handleSave = async () => {
    if (!name.trim()) { setModalError('El nombre es obligatorio'); return; }
    setSaving(true);
    setModalError(null);
    try {
      if (editing) {
        const updated = await tagsApi.update(editing.id, { name: name.trim() });
        setTags((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
      } else {
        const created = await tagsApi.create({ name: name.trim() });
        setTags((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err: any) {
      setModalError(err?.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta etiqueta?')) return;
    try {
      await tagsApi.delete(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Error al eliminar etiqueta');
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Etiquetas</h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 gradient-hero text-white text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nueva Etiqueta
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

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
                {!loading && tags.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">No hay etiquetas</td></tr>
                )}
                {!loading && tags.map((tag) => (
                  <tr key={tag.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{tag.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{tag.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(tag)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(tag.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-background rounded-xl shadow-elevated border w-full max-w-md p-6">
            <button onClick={closeModal} className="absolute top-3 right-3 p-1 rounded hover:bg-muted">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              {editing ? 'Editar etiqueta' : 'Nueva etiqueta'}
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
                placeholder="Ej: Premium"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium rounded-lg border text-foreground hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg gradient-hero text-white hover:opacity-90 disabled:opacity-60 transition-opacity">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tags;