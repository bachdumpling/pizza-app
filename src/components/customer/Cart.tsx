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
          <Card key={item.id}>
            <CardHeader>
              <h2 className="font-bold">{item.pizza.name}</h2>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <h3 className="font-medium text-md">
                    {item.pizza.type === "specialty"
                      ? "Specialty Pizza"
                      : "Custom Pizza"}{" "}
                    | {item.pizza.size.toUpperCase()}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {item.pizza.toppings && item.pizza.toppings.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {formatToppings(item).join(", ")}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full">
                  {/* Edit quantity */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Quantity:</label>
                    <Input
                      type="number"
                      min="1"
                      value={item.pizza.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          updateQuantity(item.id, value);
                        }
                      }}
                      className="w-20"
                    />
                  </div>

                  {/* Price */}
                  {/* <p className="font-medium">
                  ${item.pizza.totalPrice.toFixed(2)}
                </p> */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-16">
        <h3 className="text-lg font-semibold">
          Total: ${totalAmount.toFixed(2)}
        </h3>

        <SheetClose asChild>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}

export default Cart;
