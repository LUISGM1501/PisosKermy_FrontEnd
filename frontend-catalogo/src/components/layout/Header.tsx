import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">
              PK
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-semibold text-lg text-foreground">
              Pisos Kermy
            </span>
            <span className="text-xs text-muted-foreground block -mt-1">
              Jacó S.A.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={ROUTES.CATALOG}
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            Catálogo
          </Link>
          <Link
            to={ROUTES.ABOUT}
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            Nosotros
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-3">
            <Link
              to={ROUTES.CATALOG}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground py-2"
            >
              Catálogo
            </Link>
            <Link
              to={ROUTES.ABOUT}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground py-2"
            >
              Nosotros
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;