import { useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import Cart from "./customer/Cart";

function Nav() {
  const { items } = useCart();
  const location = useLocation();

  return (
    <header className="bg-red-600 shadow-lg border-b-4 border-yellow-400">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <a
            href="/"
            className="text-3xl transform hover:scale-110 transition-transform"
          >
            <span className="font-bold tracking-widest font-rushford leading-none text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              Bach&apos;s 🍕
            </span>
          </a>

          {/* Navigation */}
          <nav className="flex-1 px-8">
            <ul className="flex justify-center gap-6">
              {[
                { path: "/menu", label: "Menu 📖" },
                { path: "/order-lookup", label: "Order Lookup 🔍" },
                { path: "/dashboard", label: "Employee Dashboard 📊" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <a href={path}>
                    <div
                      className={`
                        px-5 py-3
                        font-bold
                        text-sm
                        rounded-lg
                        transform hover:scale-105
                        transition-all duration-200
                        border-4
                        ${
                          location.pathname === path
                            ? "bg-yellow-400 text-red-600 border-red-700 rotate-2"
                            : "bg-white text-red-600 border-yellow-400 hover:rotate-2"
                        }
                        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
                      `}
                    >
                      {label}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-yellow-400 border-4 py-5 border-red-700 text-red-600 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-yellow-400">
                    {items.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-2xl  tracking-widest font-rushford leading-none text-red-600 mb-4">
                  Your Cart
                </SheetTitle>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Nav;
