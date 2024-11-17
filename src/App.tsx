import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import "./index.css";
import Menu from "./components/customer/menu/Menu";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Menu />
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
}
