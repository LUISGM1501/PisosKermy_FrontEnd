import { useState, useEffect } from 'react';
import { Plus, Pencil, Key, Power, X, AlertCircle } from 'lucide-react';
import { adminsApi, AdminFormData } from '../../api/admins';
import { Admin } from '../../types';
import { useAuth } from '../../hooks/useAuth';

type ModalMode = 'create' | 'edit' | 'password' | null;

const Admins = () => {
  const { user: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminsApi.getAll();
      setAdmins(data);
    } catch {
      setError('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // --- Modal helpers ---
  const openCreate = () => {
    setModalMode('create');
    setEditing(null);
    setEmail('');
    setName('');
    setPassword('');
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (admin: Admin) => {
    setModalMode('edit');
    setEditing(admin);
    setEmail(admin.email);
    setName(admin.name);
    setPassword('');
    setModalError(null);
    setModalOpen(true);
  };

  const openPasswordChange = (admin: Admin) => {
    setModalMode('password');
    setEditing(admin);
    setPassword('');
    setModalError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setModalError(null);
  };

  const handleSave = async () => {
    setModalError(null);

    // Validaciones
    if (modalMode === 'create' || modalMode === 'edit') {
      if (!email.trim()) {
        setModalError('El email es obligatorio');
        return;
      }
      if (!name.trim()) {
        setModalError('El nombre es obligatorio');
        return;
      }
      if (modalMode === 'create' && !password.trim()) {
        setModalError('La contraseña es obligatoria');
        return;
      }
      if (password && password.length < 6) {
        setModalError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    if (modalMode === 'password') {
      if (!password.trim()) {
        setModalError('La contraseña es obligatoria');
        return;
      }
      if (password.length < 6) {
        setModalError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    setSaving(true);

    try {
      if (modalMode === 'create') {
        const formData: AdminFormData = {
          email: email.trim(),
          name: name.trim(),
          password: password.trim(),
        };
        const created = await adminsApi.create(formData);
        setAdmins((prev) => [created, ...prev]);
      } else if (modalMode === 'edit' && editing) {
        const formData: Partial<AdminFormData> = {
          email: email.trim(),
          name: name.trim(),
        };
        const updated = await adminsApi.update(editing.id, formData);
        setAdmins((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      } else if (modalMode === 'password' && editing) {
        await adminsApi.changePassword(editing.id, password.trim());
      }
      closeModal();
    } catch (err: any) {
      setModalError(err?.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin: Admin) => {
    const action = admin.is_active ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Seguro que deseas ${action} a ${admin.name}?`)) return;

    try {
      const updated = await adminsApi.toggleStatus(admin.id);
      setAdmins((prev) => prev.map((a) => (a.id === admin.id ? updated : a)));
    } catch (err: any) {
      setError(err?.response?.data?.error || `Error al ${action} administrador`);
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'create':
        return 'Nuevo Administrador';
      case 'edit':
        return 'Editar Administrador';
      case 'password':
        return 'Cambiar Contraseña';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Administradores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona los usuarios que tienen acceso al panel de administración
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 gradient-hero text-white text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nuevo Admin
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-4 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-background rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Nombre
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Estado
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground">
                      Cargando...
                    </td>
                  </tr>
                )}
                {!loading && admins.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground">
                      No hay administradores
                    </td>
                  </tr>
                )}
                {!loading &&
                  admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground">{admin.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {admin.name}
                        {admin.id === currentAdmin?.id && (
                          <span className="ml-2 text-xs text-muted-foreground">(tú)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{admin.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {admin.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(admin)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openPasswordChange(admin)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Cambiar contraseña"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(admin)}
                            disabled={admin.id === currentAdmin?.id}
                            className={`p-1.5 rounded-lg transition-colors ${
                              admin.id === currentAdmin?.id
                                ? 'opacity-40 cursor-not-allowed'
                                : admin.is_active
                                ? 'text-muted-foreground hover:text-orange-600 hover:bg-orange-50'
                                : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={
                              admin.id === currentAdmin?.id
                                ? 'No puedes desactivarte a ti mismo'
                                : admin.is_active
                                ? 'Desactivar'
                                : 'Activar'
                            }
                          >
                            <Power className="h-4 w-4" />
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
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 p-1 rounded hover:bg-muted"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              {getModalTitle()}
            </h2>

            {modalError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-sm">{modalError}</p>
              </div>
            )}

            <div className="space-y-4 mb-5">
              {modalMode !== 'password' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Nombre</label>
                    <input
                      autoFocus={modalMode !== 'password'}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ej: admin@pisoskermy.com"
                      className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {(modalMode === 'create' || modalMode === 'password') && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {modalMode === 'password' ? 'Nueva Contraseña' : 'Contraseña'}
                  </label>
                  <input
                    autoFocus={modalMode === 'password'}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground">
                    {modalMode === 'password'
                      ? 'El admin deberá usar esta nueva contraseña para iniciar sesión'
                      : 'Guarda esta contraseña, el admin la necesitará para iniciar sesión'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium rounded-lg border text-foreground hover:bg-muted transition-colors"
              >
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

export default Admins;