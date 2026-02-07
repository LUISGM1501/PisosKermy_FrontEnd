import { MessageCircle } from 'lucide-react';

/**
 * Botón flotante de WhatsApp que aparece en la esquina inferior derecha
 * Click para abrir chat de WhatsApp
 */
const WhatsAppFloat = () => {
  const phoneNumber = '50626431333'; // +506 2643-1333
  const message = 'Hola, me gustaría obtener más información sobre sus productos';

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      
      {/* Tooltip opcional */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Necesitas ayuda? Escríbenos
      </span>

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-75"></span>
    </button>
  );
};

export default WhatsAppFloat;