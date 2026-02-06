import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { ROUTES } from './utils/constants';

import Home from './pages/public/Home';
import Catalog from './pages/public/Catalog';
import ProductDetail from './pages/public/ProductDetail';
import About from './pages/public/About';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import Tags from './pages/admin/Tags';
import Providers from './pages/admin/Providers';
import Admins from './pages/admin/Admins';
import Audit from './pages/admin/Audit';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME}    element={<MainLayout><Home /></MainLayout>} />
        <Route path={ROUTES.CATALOG} element={<MainLayout><Catalog /></MainLayout>} />
        <Route path="/producto/:id"  element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path={ROUTES.ABOUT}   element={<MainLayout><About /></MainLayout>} />

        <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />

        <Route path={ROUTES.ADMIN_DASHBOARD}   element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_PRODUCTS}    element={<ProtectedRoute><AdminLayout><Products /></AdminLayout></ProtectedRoute>} />
        
        {/* Rutas para crear y editar productos */}
        <Route path="/admin/productos/new" element={<ProtectedRoute><AdminLayout><ProductForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/productos/:id/edit" element={<ProtectedRoute><AdminLayout><ProductForm /></AdminLayout></ProtectedRoute>} />
        
        <Route path={ROUTES.ADMIN_CATEGORIES}  element={<ProtectedRoute><AdminLayout><Categories /></AdminLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_TAGS}        element={<ProtectedRoute><AdminLayout><Tags /></AdminLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_PROVIDERS}   element={<ProtectedRoute><AdminLayout><Providers /></AdminLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_ADMINS}      element={<ProtectedRoute><AdminLayout><Admins /></AdminLayout></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_AUDIT}       element={<ProtectedRoute><AdminLayout><Audit /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;