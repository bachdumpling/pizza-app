// src/components/Layout.tsx
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

export function Layout({ children }: { children: React.ReactNode }) {
  const { items, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-xl font-bold">
              Sparrow Pizza Shop
            </a>

            {/* Nav */}
            <nav>
              <ul className="flex gap-4">
                <li>
                  <a href="/">Menu</a>
                </li>
                <li>
                  <a href="/dashboard">Employee Dashboard</a>
                </li>
                <li>
                  <a href="/order-lookup">Order Lookup</a>
                </li>
              </ul>
            </nav>

            {/* Cart Sheet */}
            <Sheet>
              {/* Cart Trigger */}
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              {/* Cart Content */}
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="mb-4">Your Cart</SheetTitle>
                </SheetHeader>
                <Cart />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
