import {
  HiringFrontendTakeHomePizzaSize,
  HiringFrontendTakeHomePizzaToppings,
  HiringFrontendTakeHomePizzaType,
  HiringFrontendTakeHomeToppingQuantity,
  OrderItem,
  PizzaTopping,
  SpecialtyPizza,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

type PizzaCardProps = {
  pizza: SpecialtyPizza;
};

interface ToppingState {
  name: any;
  count: number; // 0 for removed, 1 for regular, 2 for extra
}

/**
 * Component for displaying a pizza card with options to modify toppings, select size, and quantity, and add the pizza to the cart.
 *
 * @component
 * @param {PizzaCardProps} props - The properties for the PizzaCard component.
 * @param {Pizza} props.pizza - The pizza object containing details about the pizza.
 * @returns {JSX.Element} The rendered PizzaCard component.
 *
 * @example
 * <PizzaCard pizza={pizza} />
 *
 * @remarks
 * This component uses the `useCart` hook to add items to the cart.
 * It maintains state for the selected pizza size, quantity, and toppings.
 *
 * @function
 * @name PizzaCard
 *
 * @typedef {Object} PizzaCardProps
 * @property {Pizza} pizza - The pizza object containing details about the pizza.
 *
 * @typedef {Object} Pizza
 * @property {string} name - The name of the pizza.
 * @property {string} description - The description of the pizza.
 * @property {string[]} toppings - The list of available toppings for the pizza.
 * @property {Record<HiringFrontendTakeHomePizzaSize, number>} price - The price of the pizza based on its size.
 *
 * @typedef {Object} ToppingState
 * @property {string} name - The name of the topping.
 * @property {number} count - The count of the topping (0 for none, 1 for regular, 2 for extra).
 *
 * @typedef {Object} OrderItem
 * @property {string} id - The unique identifier for the order item.
 * @property {PizzaOrder} pizza - The pizza order details.
 *
 * @typedef {Object} PizzaOrder
 * @property {string} name - The name of the pizza.
 * @property {HiringFrontendTakeHomePizzaType} type - The type of the pizza.
 * @property {HiringFrontendTakeHomePizzaSize} size - The size of the pizza.
 * @property {PizzaTopping[]} toppings - The list of toppings for the pizza.
 * @property {HiringFrontendTakeHomePizzaToppings[]} toppingExclusions - The list of excluded toppings.
 * @property {number} quantity - The quantity of the pizza.
 * @property {number} totalPrice - The total price of the pizza order.
 *
 * @typedef {Object} PizzaTopping
 * @property {string} name - The name of the topping.
 * @property {HiringFrontendTakeHomeToppingQuantity} quantity - The quantity of the topping.
 */
function PizzaCard({ pizza }: PizzaCardProps): JSX.Element {
  const { addToCart } = useCart();

  const [size, setSize] = useState<HiringFrontendTakeHomePizzaSize>(
    HiringFrontendTakeHomePizzaSize.Medium
  );
  const [quantity, setQuantity] = useState<number>(1);

  const [toppingsState, setToppingsState] = useState<ToppingState[]>(() =>
    pizza.toppings.map((topping) => ({
      name: topping,
      count: 1,
    }))
  );

  const handleToppingChange = (toppingName: string, value: string) => {
    setToppingsState((prev) =>
      prev.map((topping) => {
        if (topping.name === toppingName) {
          return {
            ...topping,
            count: value === "removed" ? 0 : value === "extra" ? 2 : 1,
          };
        }
        return topping;
      })
    );
  };

  const getToppingExclusions = (): HiringFrontendTakeHomePizzaToppings[] => {
    return toppingsState
      .filter((topping) => topping.count === 0)
      .map((topping) => topping.name);
  };

  const getFinalToppings = (): PizzaTopping[] => {
    return toppingsState
      .filter((topping) => topping.count > 0)
      .flatMap((topping) => {
        // Convert count to quantity enum
        const quantity =
          topping.count === 2
            ? HiringFrontendTakeHomeToppingQuantity.Extra
            : HiringFrontendTakeHomeToppingQuantity.Regular;

        return {
          name: topping.name,
          quantity,
        };
      });
  };

  const handleAddToCart = () => {
    const orderItem: OrderItem = {
      id: crypto.randomUUID(),
      pizza: {
        name: pizza.name,
        type: HiringFrontendTakeHomePizzaType.Specialty,
        size,
        toppings: getFinalToppings(),
        toppingExclusions: getToppingExclusions(),
        quantity,
        totalPrice: pizza.price[size] * quantity,
      },
    };

    addToCart(orderItem);
  };

  return (
    <Card className="border-4 border-yellow-400 bg-white rounded-lg flex flex-col justify-between h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-200 overflow-hidden">
      <div>
        <CardHeader className="bg-red-600 text-white border-b-4 border-yellow-400">
          <CardTitle className="text-2xl font-bold text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            {pizza.name}
          </CardTitle>
          <CardDescription className="text-white/90 font-mono">
            {pizza.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <h4 className="font-bold text-red-600 text-lg">Modify Toppings:</h4>
            <div className="grid gap-3">
              {toppingsState.map((topping) => (
                <div
                  key={topping.name}
                  className="flex items-center justify-between p-3 bg-red-50 rounded border-2 border-red-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-medium text-red-600">
                      {topping.name}
                    </span>
                    {topping.count > 0 && (
                      <span className="text-sm text-red-500 font-mono">
                        ({topping.count}x)
                      </span>
                    )}
                  </div>
                  <Select
                    value={
                      topping.count === 0
                        ? "removed"
                        : topping.count === 2
                        ? "extra"
                        : "regular"
                    }
                    onValueChange={(value) =>
                      handleToppingChange(topping.name, value)
                    }
                  >
                    <SelectTrigger className="w-[130px] border-2 border-red-200 bg-white hover:bg-red-50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-red-200">
                      <SelectItem value="removed">None</SelectItem>
                      <SelectItem value="regular">Regular (1x)</SelectItem>
                      <SelectItem value="extra">Extra (2x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <h4 className="font-bold text-red-600 text-lg mb-2">
                Select Size:
              </h4>
              <Select
                value={size}
                onValueChange={(value) =>
                  setSize(value as HiringFrontendTakeHomePizzaSize)
                }
              >
                <SelectTrigger className="border-2 border-red-200 bg-white hover:bg-red-50 transition-colors">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200">
                  {Object.values(HiringFrontendTakeHomePizzaSize).map(
                    (size) => (
                      <SelectItem key={size} value={size}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-bold text-red-600 text-lg mb-2">Quantity:</h4>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 border-2 border-red-200 bg-white hover:bg-red-50 transition-colors"
              />
            </div>
          </div>
        </CardContent>
      </div>

      <CardContent className="p-6 bg-red-50 border-t-4 border-yellow-400">
        <Button
          onClick={handleAddToCart}
          className="py-6 w-full bg-yellow-400 hover:bg-yellow-300 text-red-600 font-bold text-md border-4 border-red-600 rounded-full transform hover:scale-105 transition-all duration-200"
        >
          Add to Cart 👍🏼
        </Button>
      </CardContent>
    </Card>
  );
}

export default PizzaCard;
