import { Navigate, Route, Routes, useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { AppProvider, useAppContext } from "./utils/app-context.jsx";
import { AdminProvider } from "./utils/admin-context.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

function RequireAuth({ children }) {
  const { user, authReady } = useAppContext();
  if (!authReady) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminSection() {
  return (
    <AdminProvider>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminSection />}>
        <Route index element={<AdminPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/orders"
        element={
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AppProvider>
      <div className="min-h-screen">
        {!isAdminRoute && <Navbar />}
        <AppRoutes />
        {!isAdminRoute && <Footer />}
      </div>
    </AppProvider>
  );
}
