import { useCart } from "@/contexts/CartContext";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  Customer,
  HiringFrontendTakeHomeOrderType,
  HiringFrontendTakeHomePaymentMethod,
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

    try {
      const customerData: Customer = {
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
      };

      const orderData = {
        locationId: LOCATION_ID,
        items,
        customer: customerData,
        totalAmount,
        paymentMethod,
        type: orderType,
        ...(paymentMethod ===
          HiringFrontendTakeHomePaymentMethod.CreditCard && {
          creditCardNumber: formData.creditCardNumber,
        }),
      };

      // Wait for the response using await
      const response = await pizzaApi.createOrder(orderData);

      clearCart();

      navigate(`/order-lookup/${response.order.id}`, {
        state: { isConfirmation: true },
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Type */}
        <Card>
          <CardHeader>
            <CardTitle>Order Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={orderType}
              onValueChange={(value) =>
                setOrderType(value as HiringFrontendTakeHomeOrderType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={HiringFrontendTakeHomeOrderType.Pickup}>
                  Pickup
                </SelectItem>
                <SelectItem value={HiringFrontendTakeHomeOrderType.Delivery}>
                  Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <div className="font-medium">
                      {item.pizza.type === "specialty"
                        ? item.pizza.name
                        : "Custom Pizza"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.pizza.size} - Qty: {item.pizza.quantity}
                    </div>
                  </div>
                  <div>${item.pizza.totalPrice.toFixed(2)}</div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 font-bold">
                <div>Total</div>
                <div>${totalAmount.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={items.length === 0}>
          Place Order
        </Button>
      </form>
    </div>
  );
}

export default Checkout;
