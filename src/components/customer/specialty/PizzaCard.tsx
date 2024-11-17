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
} from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
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
    // console.log("Adding to cart:", {
    //   pizza,
    //   toppings: getFinalToppings(),
    //   toppingExclusions: getToppingExclusions(),
    //   size,
    //   quantity,
    //   totalPrice: pizza.price[size] * quantity,
    // });

    const orderItem: OrderItem = {
      id: crypto.randomUUID(),
      pizza: {
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
    <Card
      key={pizza.id}
      className="p-4 border border-gray-200 rounded-md flex flex-col justify-between h-full"
    >
      {/* Pizza Name */}
      <CardHeader>
        <CardTitle>{pizza.name}</CardTitle>
        <CardDescription>{pizza.description}</CardDescription>
      </CardHeader>

      {/* Pizza Selection */}
      <CardContent className="space-y-4 ">
        {/* Toppings Management */}
        <div className="space-y-4">
          <h4 className="font-medium mb-2">Modify Toppings:</h4>
          <div className="grid gap-2">
            {toppingsState.map((topping) => (
              <div
                key={topping.name}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="capitalize">{topping.name}</span>
                  {topping.count > 0 && (
                    <span className="text-sm text-gray-500">
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
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="removed">None</SelectItem>
                    <SelectItem value="regular">Regular (1x)</SelectItem>
                    <SelectItem value="extra">Extra (2x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="w-full flex flex-row gap-4">
          <div className="w-full">
            <h4 className="font-medium mb-2">Select Size:</h4>

            <Select
              value={size}
              onValueChange={(value) => {
                setSize(value as HiringFrontendTakeHomePizzaSize);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={HiringFrontendTakeHomePizzaSize.Small}>
                  Small
                </SelectItem>
                <SelectItem value={HiringFrontendTakeHomePizzaSize.Medium}>
                  Medium
                </SelectItem>
                <SelectItem value={HiringFrontendTakeHomePizzaSize.Large}>
                  Large
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
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
        </div>

        {/* Price */}
        {/* <div className="text-lg font-semibold">
          Total: ${(pizza.price[size] * quantity).toFixed(2)}
        </div> */}
      </CardContent>
      <CardContent className="">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

export default PizzaCard;
