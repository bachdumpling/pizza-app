import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import "./index.css";
import Menu from "./components/customer/Menu";
import Checkout from "./components/customer/Checkout";
import OrderLookup from "./components/customer/OrderLookup";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/dashboard" element={<EmployeeDashboard />} />

            <Route path="/order-lookup" element={<OrderLookup />}>
              <Route path=":orderId" element={<OrderLookup />} />
            </Route>
            
            <Route path="/order-status/:orderId" element={<OrderLookup />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}
