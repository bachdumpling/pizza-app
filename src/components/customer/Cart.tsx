import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { SheetClose } from "../ui/sheet";
import { Pizza } from "@/types";

interface CartItem {
  id: string;
  pizza: Pizza;
}

/**
 * Cart component that displays the items in the user's cart and allows for interaction such as updating quantities and removing items.
 * 
 * @component
 * @example
 * // Usage example:
 * // <Cart />
 * 
 * @returns {JSX.Element} The rendered Cart component.
 * 
 * @remarks
 * - If the cart is empty, a message is displayed indicating that the cart is empty.
 * - For each item in the cart, a card is displayed with the pizza details, quantity input, and a remove button.
 * - The total amount is displayed at the bottom with a checkout button.
 * 
 * @function formatToppings
 * Formats the toppings of a pizza item for display.
 * 
 * @param {CartItem} item - The cart item containing the pizza and its toppings.
 * @returns {string[]} An array of formatted topping strings.
 * 
 * @function handleCheckout
 * Navigates the user to the checkout page.
 * 
 * @hook useCart
 * Custom hook to retrieve cart-related data and actions.
 * 
 * @hook useNavigate
 * Custom hook to navigate programmatically.
 */

function Cart() {
  const { items, removeFromCart, totalAmount, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!(items.length > 0)) {
    return (
      <h2 className="text-center p-4 font-medium text-md">
        Your cart is empty
      </h2>
    );
  }

  function formatToppings(item: CartItem): string[] {
    if (item.pizza.type !== "custom") {
      // Get all toppings from the pizza
      const toppings = item.pizza.toppings;
      const exclusions = item.pizza.toppingExclusions || [];

      // Create a map of topping names to their quantities
      const toppingMap = toppings.reduce((acc, topping) => {
        acc[topping.name] = topping.quantity;
        return acc;
      }, {} as Record<string, string>);

      // Get all unique topping names (both included and excluded)
      const allToppingNames = Array.from(
        new Set([...toppings.map((t) => t.name), ...exclusions])
      );

      // Format each topping based on its state
      return allToppingNames.map((toppingName) => {
        // If it's excluded, show as "no X"
        if (exclusions.includes(toppingName)) {
          return `no ${toppingName.replace("_", " ")}`;
        }

        // If it exists in our toppings, format based on quantity
        const quantity = toppingMap[toppingName];
        if (quantity === "extra") {
          return `extra ${toppingName.replace("_", " ")}`;
        }
        // For regular quantity, just show the name
        return toppingName.replace("_", " ");
      });
    } else {
      // For custom pizzas, directly format based on quantity and name
      return item.pizza.toppings.map(
        (topping) => `${topping.quantity} ${topping.name.replace("_", " ")}`
      );
    }
  }

  function handleCheckout() {
    navigate("/checkout");
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <CardHeader className="bg-red-600 border-b-4 border-yellow-400 rounded-t-lg">
              <h2 className="font-bold text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                {item.pizza.name}
              </h2>
            </CardHeader>

            <CardContent className="rounded-b-lg p-4 space-y-4 bg-white">
              <div className="w-full">
                <h3 className="font-bold text-red-600">
                  {item.pizza.type === "specialty"
                    ? "Specialty Pizza"
                    : "Custom Pizza"}{" "}
                  | {item.pizza.size.toUpperCase()}
                </h3>
                <span className="text-sm text-red-800">
                  {formatToppings(item).join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium text-red-600">Quantity:</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.pizza.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) updateQuantity(item.id, value);
                    }}
                    className="w-20 border-2 border-red-200"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 font-bold border-2 border-red-700"
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 mb-4 border-t-4 border-yellow-400 pt-4">
        <h3 className="text-xl font-bold text-red-600">
          Total: ${totalAmount.toFixed(2)}
        </h3>

        <SheetClose asChild>
          <Button
            className="w-full mt-4 mb-6 bg-yellow-400 text-red-600 font-bold border-4 border-red-600 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200"
            onClick={handleCheckout}
          >
            Checkout 🍕
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}

export default Cart;
