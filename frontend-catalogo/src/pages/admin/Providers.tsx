import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { providersApi }  from '../../api/providers';
import { Provider, ProviderFormData } from '../../types';

const Providers = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<Provider | null>(null);
  const [form, setForm]               = useState<ProviderFormData>({ name: '' });
  const [saving, setSaving]           = useState(false);
  const [modalError, setModalError]   = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      setProviders(await providersApi.getAll());
    } catch {
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  // --- modal ---
  const emptyForm: ProviderFormData = { name: '', contact: '', phone: '', description: '' };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (p: Provider) => {
    setEditing(p);
    setForm({
      name:        p.name,
      contact:     p.contact || '',
      phone:       p.phone || '',
      description: p.description || '',
    });
    setModalError(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setModalError(null); };

  const setField = (key: keyof ProviderFormData, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.name?.trim()) { setModalError('El nombre es obligatorio'); return; }
    setSaving(true);
    setModalError(null);
    try {
      const payload: ProviderFormData = {
        name:        form.name.trim(),
        contact:     form.contact?.trim() || undefined,
        phone:       form.phone?.trim()   || undefined,
        description: form.description?.trim() || undefined,
      };
      if (editing) {
        const updated = await providersApi.update(editing.id, payload);
        setProviders((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const created = await providersApi.create(payload);
        setProviders((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err: any) {
      setModalError(err?.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    try {
      await providersApi.delete(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Error al eliminar proveedor');
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Proveedores</h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 gradient-hero text-white text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nuevo Proveedor
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Contacto</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Teléfono</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Cargando...</td></tr>
                )}
                {!loading && providers.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No hay proveedores</td></tr>
                )}
                {!loading && providers.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.contact || 'N/A'}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
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
          <div className="relative bg-background rounded-xl shadow-elevated border w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-3 right-3 p-1 rounded hover:bg-muted">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              {editing ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h2>
            {modalError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-3">
                <p className="text-destructive text-sm">{modalError}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-5">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Nombre <span className="text-destructive">*</span></label>
                <input
                  autoFocus
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Nombre del proveedor"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Contacto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Contacto</label>
                <input
                  type="text"
                  value={form.contact || ''}
                  onChange={(e) => setField('contact', e.target.value)}
                  placeholder="Email o nombre de contacto"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Teléfono</label>
                <input
                  type="tel"
                  value={form.phone || ''}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+506 xxxx-xxxx"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Descripción</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Descripción opcional del proveedor"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
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

export default Providers;