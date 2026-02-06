import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Package,
  Tag,
  Truck,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Home,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard',    href: '/admin/dashboard',   icon: LayoutDashboard },
  { name: 'Productos',    href: '/admin/productos',   icon: Package },
  { name: 'Categorías',   href: '/admin/categorias',  icon: Tag },
  { name: 'Etiquetas',    href: '/admin/etiquetas',   icon: Tag },
  { name: 'Proveedores',  href: '/admin/proveedores', icon: Truck },
  { name: 'Admins',       href: '/admin/admins',      icon: Users },
  { name: 'Bitácora',     href: '/admin/bitacora',    icon: ClipboardList },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4 shrink-0">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">PK</span>
            </div>
            <span className="font-display font-semibold text-sm text-sidebar-foreground">Pisos Kermy</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin/dashboard" className="mx-auto">
            <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">PK</span>
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-primary text-white'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-1 shrink-0">
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Ver Tienda</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {!collapsed && user && (
          <div className="px-3 py-2 mt-2 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email || user.name}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 bg-sidebar flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0',
          collapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <div className="flex items-center justify-end px-2 pt-2 lg:hidden">
          <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-sidebar-accent">
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <SidebarContent />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-8 border-t border-sidebar-border hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft className={cn('h-4 w-4 text-sidebar-foreground transition-transform', collapsed && 'rotate-180')} />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 flex items-center gap-4 border-b bg-background px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 rounded hover:bg-muted">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-display font-semibold text-foreground text-sm sm:text-base">Panel de Administración</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;