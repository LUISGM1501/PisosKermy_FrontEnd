import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { siteContentApi } from '../../api/siteContent';

const Content = () => {
  const [content, setContent]   = useState('');
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [saved, setSaved]       = useState(false); // toast flag

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await siteContentApi.get('about_us');
        setContent(data.content || '');
      } catch {
        setError('Error al cargar contenido');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteContentApi.update('about_us', content);
      setSaved(true);
      // auto-hide toast after 3s
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar contenido');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Contenido del sitio</h1>
        </div>

        {/* Section label */}
        <div className="bg-background rounded-xl border shadow-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-1">Sobre Nosotros</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Este contenido se muestra en la pagina publica "Sobre Nosotros".
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
          ) : (
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escriba el contenido de la pagina Sobre Nosotros..."
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none leading-relaxed"
            />
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-6 py-2 text-sm font-medium rounded-lg gradient-hero text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast de exito */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-background border border-success/40 shadow-elevated rounded-lg px-5 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="h-5 w-5 text-success shrink-0" />
          <p className="text-sm text-foreground font-medium">Contenido guardado correctamente</p>
        </div>
      )}
    </>
  );
};

export default Content;