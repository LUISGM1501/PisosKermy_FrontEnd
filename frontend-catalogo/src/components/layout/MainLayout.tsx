import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "../common/WhatsAppFloat";

interface MainLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const MainLayout = ({ children, hideFooter = false }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <WhatsAppFloat />
    </div>
  );
};

export default MainLayout;