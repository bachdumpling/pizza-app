import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

function Cart() {
  const { items, removeFromCart, totalAmount, updateQuantity } = useCart();

  if (!(items.length > 0)) {
    return (
      <h2 className="text-center p-4 font-medium text-md">
        Your cart is empty
      </h2>
    );
  }

  function formatToppings(toppings: string[]): string[] {
    const toppingCount = toppings.reduce((acc, topping) => {
      acc[topping] = (acc[topping] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(toppingCount).map((topping) =>
      toppingCount[topping] > 1 ? `Extra ${topping}` : topping
    );
  }

  return (
    <div className="">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <h2 className="font-bold">{item.pizza.name}</h2>
          </CardHeader>

          <CardContent className="">
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
                      {formatToppings(item.pizza.toppings).join(", ")}
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

      <div className="text-xl font-bold mt-4">
        Total: ${totalAmount.toFixed(2)}
      </div>
    </div>
  );
}

export default Cart;
