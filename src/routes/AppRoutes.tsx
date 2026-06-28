import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Contact from "../pages/customer/Contact";
import About from "../pages/customer/About";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import { BrandsPage } from "../features/brand";
import AdminProducts from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customers";
import Inventory from "../pages/admin/Inventory";
import Settings from "../pages/admin/Settings";
import ProtectedRoute from "./ProtectedRoute";

import NotFound from "../pages/error/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
      </Route>

      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "MANAGER"]} />}>
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
