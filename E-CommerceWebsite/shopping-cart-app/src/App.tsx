import "./index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./pages/home";
import { AuthPage } from "./components/authPage";
import { AuthLayout } from "./components/authLayouts";
import { AddProduct } from "./pages/addProducts";
import { CartPage } from "./pages/cart";
import { ResetPassword } from "./components/resetPassword";
import RequireRole from "./auth/requireRole";
import { NotificationsPage } from "./pages/notifications";
import { AdminNotificationsPage } from "./pages/adminNotifications";
import RoleLayout from "./auth/roleLayout";
import { AddProductCategories } from "./pages/addProdCategories";
import { OrdersPage } from "./pages/orderHistory";
import { Toaster } from "react-hot-toast";
import RequireAuth from "./auth/requireAuth";
import { Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { AdminNotificationProvider } from "./context/adminNotificationContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SessionPopup } from "./components/sessionPopup";

export let globalNavigate: ReturnType<typeof useNavigate>;

function App() {
  const navigate = useNavigate();
  globalNavigate = navigate;

  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 72,
          right: 16,
        }}
        toastOptions={{
          duration: 4000,
          style: { zIndex: 9999 },
        }}
        reverseOrder={false}
      />
      <SessionPopup />
      <section>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route
              element={
                <CartProvider>
                  <OrdersProvider>
                    <NotificationProvider>
                      <RoleLayout />
                    </NotificationProvider>
                  </OrdersProvider>
                </CartProvider>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/notification" element={<NotificationsPage />} />
              <Route path="/categories" element={<AddProductCategories />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route
                element={
                  <AdminNotificationProvider>
                    <Outlet />
                  </AdminNotificationProvider>
                }
              >
                <Route path="/add-products" element={<AddProduct />} />
                <Route
                  path="/admin-notification"
                  element={<AdminNotificationsPage />}
                />
              </Route>
            </Route>
          </Route>
          {/* </Route> */}
        </Routes>
      </section>
    </>
  );
}

export default App;
