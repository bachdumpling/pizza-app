import React, { useState } from "react";
import {
  HiringFrontendTakeHomePizzaSize,
  HiringFrontendTakeHomePizzaToppings,
  HiringFrontendTakeHomePizzaType,
  HiringFrontendTakeHomeToppingQuantity,
  OrderItem,
  PizzaTopping,
} from "@/types";
import { GetPizzaPricingResponse } from "@/types/api";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CustomPizzaProps = {
  pricing: GetPizzaPricingResponse;
};

const CustomPizza: React.FC<CustomPizzaProps> = ({ pricing }) => {
  const { addToCart } = useCart();
  const [size, setSize] = useState<HiringFrontendTakeHomePizzaSize>(
    HiringFrontendTakeHomePizzaSize.Medium
  );
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState<PizzaTopping[]>([]);
  
  const calculatePrice = () => {
    if (!pricing) return 0;

    const basePrice = pricing.size[size];
    const toppingsPrice = toppings.reduce((total, topping) => {
      return total + pricing.toppingPrices[topping.name][topping.quantity];
    }, 0);

    return (basePrice + toppingsPrice) * quantity;
  };

  const handleToppingChange = (
    toppingName: HiringFrontendTakeHomePizzaToppings,
    quantity: HiringFrontendTakeHomeToppingQuantity | "none"
  ) => {
    if (quantity === "none") {
      setToppings(toppings.filter((t) => t.name !== toppingName));
    } else {
      const existingTopping = toppings.find((t) => t.name === toppingName);
      if (existingTopping) {
        setToppings(
          toppings.map((t) => (t.name === toppingName ? { ...t, quantity } : t))
        );
      } else {
        setToppings([...toppings, { name: toppingName, quantity }]);
      }
    }
  };

  const handleAddToCart = () => {
    console.log("Adding to cart", {
      name: "Custom Pizza",
      type: HiringFrontendTakeHomePizzaType.Custom,
      size,
      quantity,
      toppings,
      totalPrice: calculatePrice(),
    });
    const orderItem: OrderItem = {
      id: crypto.randomUUID(),
      pizza: {
        name: "Custom Pizza",
        type: HiringFrontendTakeHomePizzaType.Custom,
        size,
        toppings,
        quantity,
        totalPrice: calculatePrice(),
      },
    };

    addToCart(orderItem);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Custom Pizza</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Size Selection */}
        <div>
          <h4 className="font-medium mb-2">Select Size:</h4>
          <Select
            value={size}
            onValueChange={(value) =>
              setSize(value as HiringFrontendTakeHomePizzaSize)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(pricing?.size || {}).map(([size, price]) => (
                <SelectItem key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)} (${price})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toppings Selection */}
        <div>
          <h4 className="font-medium mb-2">Select Toppings:</h4>
          <div className="grid gap-2">
            {Object.entries(pricing?.toppingPrices || {}).map(
              ([topping, prices]) => (
                <div
                  key={topping}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="capitalize">
                    {topping.replace("_", " ")}
                  </span>
                  <Select
                    value={
                      toppings.find((t) => t.name === topping)?.quantity ||
                      "none"
                    }
                    onValueChange={(value) =>
                      handleToppingChange(
                        topping as HiringFrontendTakeHomePizzaToppings,
                        value as HiringFrontendTakeHomeToppingQuantity | "none"
                      )
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {Object.entries(prices).map(([quantity, price]) => (
                        <SelectItem key={quantity} value={quantity}>
                          {quantity.charAt(0).toUpperCase() + quantity.slice(1)}{" "}
                          (${price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <div>
            <h4 className="font-medium mb-2">Quantity:</h4>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20"
            />
          </div>
          <div className="flex-1 text-right">
            <h4 className="font-medium mb-2">Total Price:</h4>
            <div className="text-lg font-semibold">
              ${calculatePrice().toFixed(2)}
            </div>
          </div>
        </div>

        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomPizza;
