import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { authApi } from '../../api/auth';

interface AuditEntry {
  id:           number;
  admin_id:     number;
  admin_email:  string | null;
  action:       string;
  entity:       string | null;
  entity_id:    number | null;
  details:      any;
  ip_address:   string | null;
  created_at:   string | null;
}

const Audit = () => {
  const [logs, setLogs]         = useState<AuditEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.getAuditLogs(p);
      setLogs(res.logs as unknown as AuditEntry[]);
      setTotalPages((res as any).pages || 1);
    } catch {
      setError('Error al cargar la bitácora');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(page); }, [page]);

  const formatDate = (iso: string | null) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('es-CR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDetails = (details: any) => {
    if (!details) return '-';
    if (typeof details === 'string') return details;
    return JSON.stringify(details);
  };

  // Formatear entity y details para LOGIN
  const getEntityDisplay = (log: AuditEntry) => {
    if (log.action.toUpperCase() === 'LOGIN') return 'Iniciar sesión';
    if (!log.entity) return '-';
    return (
      <>
        {log.entity}
        {log.entity_id != null && <span className="text-muted-foreground/60"> #{log.entity_id}</span>}
      </>
    );
  };

  const getDetailsDisplay = (log: AuditEntry) => {
    if (log.action.toUpperCase() === 'LOGIN') return 'Iniciar sesión';
    return formatDetails(log.details);
  };

  // Action badge colors
  const actionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE': return 'bg-success/10 text-success';
      case 'UPDATE': return 'bg-warning/10 text-warning';
      case 'DELETE': return 'bg-destructive/10 text-destructive';
      case 'LOGIN': return 'bg-primary/10 text-primary';
      default:       return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Bitácora de auditoría</h1>
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Admin</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Acción</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Entidad</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Detalles</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">IP</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Cargando...</td></tr>
                )}
                {!loading && logs.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No hay entradas en la bitácora</td></tr>
                )}
                {!loading && logs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(log.created_at)}</td>
                    <td className="px-4 py-3 text-foreground">{log.admin_email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${actionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {getEntityDisplay(log)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                      {getDetailsDisplay(log)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{log.ip_address || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t px-4 py-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Audit;