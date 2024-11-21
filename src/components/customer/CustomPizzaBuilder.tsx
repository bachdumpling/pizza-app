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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type CustomPizzaProps = {
  pricing: GetPizzaPricingResponse;
};

/**
 * CustomPizza component allows users to build their custom pizza by selecting size, toppings, and quantity.
 * It calculates the total price based on the selected options and allows adding the custom pizza to the cart.
 *
 * @component
 * @param {CustomPizzaProps} props - The properties for the CustomPizza component.
 * @param {Pricing} props.pricing - The pricing details for different pizza sizes and toppings.
 *
 * @returns {JSX.Element} The rendered CustomPizza component.
 *
 * @example
 * <CustomPizza pricing={pricingData} />
 *
 * @remarks
 * This component uses the `useCart` hook to add the custom pizza to the cart.
 * It also uses the `useState` hook to manage the state of size, quantity, and toppings.
 * The `calculatePrice` function computes the total price based on the selected options.
 * The `handleToppingChange` function updates the toppings state when a topping is selected or removed.
 * The `handleAddToCart` function generates a custom pizza name using OpenAI's GPT-4 model and adds the pizza to the cart.
 */
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
      // Convert spaces to underscores to match API format
      const apiToppingName = topping.name.replace(" ", "_");
      if (
        pricing.toppingPrices[apiToppingName] &&
        pricing.toppingPrices[apiToppingName][topping.quantity]
      ) {
        return total + pricing.toppingPrices[apiToppingName][topping.quantity];
      }
      return total;
    }, 0);

    return (basePrice + toppingsPrice) * quantity;
  };

  const handleToppingChange = (
    toppingName: string,
    quantity: HiringFrontendTakeHomeToppingQuantity | "none"
  ) => {
    const formattedToppingName = toppingName.replace("_", " "); // Format the topping name

    if (quantity === "none") {
      setToppings(toppings.filter((t) => t.name !== formattedToppingName));
    } else {
      const existingTopping = toppings.find(
        (t) => t.name === formattedToppingName
      );
      if (existingTopping) {
        setToppings(
          toppings.map((t) =>
            t.name === formattedToppingName ? { ...t, quantity } : t
          )
        );
      } else {
        setToppings([
          ...toppings,
          {
            name: formattedToppingName as HiringFrontendTakeHomePizzaToppings,
            quantity,
          },
        ]);
      }
    }
  };

  const handleAddToCart = () => {
    async function createCustomPizzaName(): Promise<string> {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are an expert Pizza Chef." },
            {
              role: "user",
              content: `Return a short string of maximum 3 words that describes this custom pizza with ${size} size and ${toppings
                .map((t) => `${t.quantity} ${t.name}`)
                .join(", ")}. Make the name funny, retro, and unique!`,
            },
          ],
          model: "gpt-4o",
        });

        return completion.choices[0].message.content;
      } catch (error) {
        console.error("Failed to create custom pizza name:", error);
        return "Custom Pizza";
      }
    }
    createCustomPizzaName().then((pizzaName) => {
      const orderItem: OrderItem = {
        id: crypto.randomUUID(),
        pizza: {
          name: pizzaName,
          type: HiringFrontendTakeHomePizzaType.Custom,
          size,
          toppings,
          quantity,
          totalPrice: calculatePrice(),
        },
      };

      console.log("Adding to cart", orderItem);

      addToCart(orderItem);
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
      <CardHeader className="bg-red-600 border-b-4 border-yellow-400">
        <CardTitle className="text-2xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] uppercase tracking-wide transform -rotate-1">
          Build Your Dream Pizza! 🎨
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 p-6 bg-white">
        {/* Size Selection */}
        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-100">
          <h4 className="font-black text-red-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="bg-yellow-400 px-3 py-1 rounded-full transform -rotate-2 inline-block shadow-md">
              Step 1
            </span>
            Pick Your Size
          </h4>
          <Select
            value={size}
            onValueChange={(value) =>
              setSize(value as HiringFrontendTakeHomePizzaSize)
            }
          >
            <SelectTrigger className="w-full border-2 border-red-200 hover:bg-white transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-red-200">
              {Object.entries(pricing?.size || {}).map(([size, price]) => (
                <SelectItem key={size} value={size} className="font-bold">
                  {size.charAt(0).toUpperCase() + size.slice(1)} (${price})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toppings Selection */}
        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-100">
          <h4 className="font-black text-red-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="bg-yellow-400 px-3 py-1 rounded-full transform -rotate-2 inline-block shadow-md">
              Step 2
            </span>
            Choose Your Toppings
          </h4>
          <div className="grid gap-3">
            {Object.entries(pricing?.toppingPrices || {}).map(
              ([topping, prices]) => (
                <div
                  key={topping}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-red-200 hover:border-red-300 transition-colors"
                >
                  <span className="font-bold text-red-600 capitalize">
                    {topping.replace("_", " ")}
                  </span>
                  <Select
                    value={
                      toppings.find((t) => t.name === topping.replace("_", " "))
                        ?.quantity || "none"
                    }
                    onValueChange={(value) =>
                      handleToppingChange(
                        topping,
                        value as HiringFrontendTakeHomeToppingQuantity | "none"
                      )
                    }
                  >
                    <SelectTrigger className="w-[150px] border-2 border-red-200 hover:bg-red-50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-red-200">
                      <SelectItem value="none">None</SelectItem>
                      {Object.entries(prices).map(([quantity, price]) => (
                        <SelectItem
                          key={quantity}
                          value={quantity}
                          className="font-bold"
                        >
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

        {/* Quantity and Price */}
        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-100 flex flex-wrap gap-6 items-end justify-between">
          <div>
            <h4 className="font-black text-red-600 uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="bg-yellow-400 px-3 py-1 rounded-full transform -rotate-2 inline-block shadow-md">
                Step 3
              </span>
              How Many?
            </h4>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-24 border-2 border-red-200 focus:border-red-400 focus:ring-red-400 text-center font-bold"
            />
          </div>
          <div className="text-right">
            <h4 className="font-black text-red-600 uppercase tracking-wide mb-2">
              Total Price
            </h4>
            <div className="text-2xl font-black text-red-600 bg-yellow-300 px-4 py-2 rounded-lg transform -rotate-2 shadow-md">
              ${calculatePrice().toFixed(2)}
            </div>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-600 font-black text-xl border-4 border-red-600 
        rounded-xl transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
        uppercase tracking-wider py-6 hover:-rotate-1"
        >
          Add to Cart 🛒
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomPizza;
