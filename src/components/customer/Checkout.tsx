import { useCart } from "@/contexts/CartContext";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  Customer,
  HiringFrontendTakeHomeOrderRequest,
  HiringFrontendTakeHomeOrderType,
  HiringFrontendTakeHomePaymentMethod,
  HiringFrontendTakeHomePizzaType,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { pizzaApi } from "@/hooks/usePizzaApi";
import { useNavigate } from "react-router";

const LOCATION_ID = import.meta.env.VITE_LOCATION_ID;

function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();

  const [orderType, setOrderType] = useState<HiringFrontendTakeHomeOrderType>(
    HiringFrontendTakeHomeOrderType.Delivery
  );
  const [paymentMethod, setPaymentMethod] =
    useState<HiringFrontendTakeHomePaymentMethod>(
      HiringFrontendTakeHomePaymentMethod.CreditCard
    );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    creditCardNumber: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const orderData: HiringFrontendTakeHomeOrderRequest = {
      locationId: LOCATION_ID,
      items: items.map((item) => ({
        id: item.id,
        pizza: {
          type: item.pizza.type,
          size: item.pizza.size,
          toppings: item.pizza.toppings || [],
          ...(item.pizza.type === HiringFrontendTakeHomePizzaType.Specialty && {
            toppingExclusions: item.pizza.toppingExclusions,
          }),
          quantity: item.pizza.quantity,
          totalPrice: item.pizza.totalPrice,
        },
      })),
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        ...(orderType === HiringFrontendTakeHomeOrderType.Delivery && {
          deliveryAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
        }),
      },
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      ...(paymentMethod === HiringFrontendTakeHomePaymentMethod.CreditCard && {
        creditCardNumber: formData.creditCardNumber,
      }),
      type: orderType,
    };

    try {
      const response = await pizzaApi.createOrder(orderData);
      clearCart();
      navigate(`/order-lookup/${response.order.id}`, {
        state: { isConfirmation: true },
      });
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mb-10">
      <h1 className="text-4xl font-black text-red-600 text-center mb-10 mt-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] tracking-wide uppercase transform -rotate-2">
        Ready to Order! 🍕
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Type */}
        <Card className="border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
          <CardHeader className="bg-red-600 border-b-4 border-yellow-400">
            <CardTitle className="text-xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] uppercase tracking-wide transform rotate-1">
              Pick Your Style 🛵
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <Select
              value={orderType}
              onValueChange={(value) =>
                setOrderType(value as HiringFrontendTakeHomeOrderType)
              }
            >
              <SelectTrigger className="border-2 border-red-200 hover:bg-red-50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-red-200">
                <SelectItem value={HiringFrontendTakeHomeOrderType.Pickup}>
                  📍 Local Pickup
                </SelectItem>
                <SelectItem value={HiringFrontendTakeHomeOrderType.Delivery}>
                  🛵 Home Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <CardHeader className="rounded-t-lg bg-red-600 border-b-4 border-yellow-400">
            <CardTitle className="text-xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] uppercase tracking-wide transform -rotate-1">
              Your Details 👋
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-b-lg space-y-4 p-6 bg-white">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Ask for delivery address */}
              {orderType === HiringFrontendTakeHomeOrderType.Delivery && (
                <div className="space-y-4 border-t-4 border-yellow-400 pt-4 mt-6">
                  <h3 className="text-lg font-black text-red-600 uppercase tracking-wide transform -rotate-1 inline-block bg-yellow-200 px-4 py-1 rounded-lg shadow-md">
                    Delivery Zone 🚚
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Street Address
                      </label>
                      <Input
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          State
                        </label>
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          ZIP Code
                        </label>
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <CardHeader className="rounded-t-lg bg-red-600 border-b-4 border-yellow-400">
            <CardTitle className="text-xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] uppercase tracking-wide transform rotate-1">
              The Good Stuff 🔥
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-b-lg p-6 bg-white">
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b-2 border-red-100 bg-red-50 transition-colors rounded-lg px-3"
                >
                  <div>
                    <div className="font-extrabold text-red-600 tracking-wide">
                      {item.pizza.type === "specialty"
                        ? item.pizza.name
                        : "Custom Pizza"}
                    </div>
                    <div className="text-sm font-bold text-red-500">
                      {item.pizza.size.toUpperCase()} - QTY:{" "}
                      {item.pizza.quantity}
                    </div>
                  </div>
                  <div className="font-black text-red-600 bg-yellow-200 px-3 py-1 rounded-full transform rotate-3">
                    ${item.pizza.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 mt-4 border-t-4 border-yellow-400">
                <div className="text-xl font-black text-red-600 uppercase tracking-wide">
                  Total
                </div>
                <div className="text-xl font-black text-red-600 bg-yellow-300 px-4 py-2 rounded-lg transform -rotate-2 shadow-md">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <CardHeader className="rounded-t-lg bg-red-600 border-b-4 border-yellow-400">
            <CardTitle className="text-xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] uppercase tracking-wide transform -rotate-1">
              Payment Time 💳
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-b-lg space-y-4 p-6 bg-white">
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as HiringFrontendTakeHomePaymentMethod)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={HiringFrontendTakeHomePaymentMethod.Cash}>
                  Cash
                </SelectItem>
                <SelectItem
                  value={HiringFrontendTakeHomePaymentMethod.CreditCard}
                >
                  Credit Card
                </SelectItem>
              </SelectContent>
            </Select>
            {paymentMethod ===
              HiringFrontendTakeHomePaymentMethod.CreditCard && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Credit Card Number
                </label>
                <Input
                  name="creditCardNumber"
                  value={formData.creditCardNumber}
                  onChange={handleInputChange}
                  placeholder="Enter card number"
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={items.length === 0}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-600 font-bold text-lg border-4 border-red-600 rounded-full transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed py-6"
        >
          Place Order 🍕
        </Button>
      </form>
    </div>
  );
}

export default Checkout;
