import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
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

        {/* Mobile menu button - simplified version */}
        <button className="md:hidden text-gray-700">
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;