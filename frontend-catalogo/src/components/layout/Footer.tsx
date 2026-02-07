import { Link } from "react-router-dom";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const Footer = () => {
  // Números de WhatsApp
  const whatsappNumbers = [
    { number: "+506 2643-1333", link: "50626431333", label: "Jacó" },
    { number: "+506 2777-3636", link: "50627773636", label: "Quepos" },
    { number: "+506 2777-4838", link: "50627774838", label: "Quepos" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Info empresa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">PK</span>
              </div>
              <div>
                <span className="font-display font-semibold text-lg">Pisos Kermy</span>
                <span className="text-xs text-primary-foreground/70 block -mt-1">Jacó S.A.</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Especialistas en pisos y revestimientos de alta calidad para proyectos residenciales y comerciales.
            </p>
          </div>

          {/* enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Enlaces</h4>
            <nav className="flex flex-col gap-2">
              <Link to={ROUTES.CATALOG} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Catálogo
              </Link>
              <Link to={ROUTES.ABOUT} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Nosotros
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Contacto</h4>
            <div className="flex flex-col gap-3">
              {/* WhatsApp Numbers */}
              <div className="flex flex-col gap-2">
                {whatsappNumbers.map((item, index) => (
                  <a
                    key={index}
                    href={`https://wa.me/${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors group"
                  >
                    <MessageCircle className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:underline">
                      {item.number} <span className="text-xs opacity-60">({item.label})</span>
                    </span>
                  </a>
                ))}
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>pisoskermy@gmail.com</span>
              </div>

              {/* Ubicación */}
              <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Jacó, Puntarenas, Costa Rica</span>
              </div>
            </div>
          </div>

          {/* Horario */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Horario</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Lun - Vie: 9:00 - 17:00</span>
              </div>
              <div className="text-sm text-primary-foreground/80 pl-7">
                Sáb: 9:00 - 12:00
              </div>
              <div className="text-sm text-primary-foreground/80 pl-7">
                Dom: Cerrado
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Pisos Kermy Jacó S.A. Todos los derechos reservados.
          </p>

          {/* Enlace invisible para acceso admin */}
          <Link
            to={ROUTES.ADMIN_LOGIN}
            className="text-primary-foreground/10 hover:text-primary-foreground/30 text-xs transition-colors"
            title="Admin"
          >
            •
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;