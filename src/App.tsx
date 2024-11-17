import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import "./index.css";
import Menu from "./components/customer/menu/Menu";
import Checkout from "./components/customer/Checkout";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}
