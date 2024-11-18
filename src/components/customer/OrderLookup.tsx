import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { pizzaApi } from "@/hooks/usePizzaApi";
import { useLocation, useNavigate, useParams } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import {
  HiringFrontendTakeHomeOrderResponse,
  HiringFrontendTakeHomeOrderType,
} from "@/types";
import { formatDate } from "@/lib/utils";
import StatusBadge from "../ui/StatusBadge";

function OrderLookup() {
  const { orderId: urlOrderId } = useParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isConfirmation = location.state?.isConfirmation;
  const navigate = useNavigate();

  useEffect(() => {
    if (urlOrderId) {
      handleLookup(urlOrderId);
    }
  }, [urlOrderId]);

  const handleLookup = async (id: string = orderId) => {
    if (!id.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await pizzaApi.getOrderById(id);
      setOrder(response.order);
      // Update URL if it's not already there
      if (!urlOrderId) {
        navigate(`/order-lookup/${id}`, { replace: true });
      }
    } catch (err) {
      setError("Order not found: " + err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await pizzaApi.cancelOrder(order.id);
      setOrder({ ...order, status: "cancelled" });
    } catch (err) {
      setError("Failed to cancel order:" + err);
    }
  };

  return (
    <div className="w-full py-8">
      <Card className="max-w-2xl mx-auto border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
        <CardHeader className="rounded-t-lg bg-red-600 border-b-4 border-yellow-400">
          <CardTitle className="text-2xl font-rushford tracking-widest text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            {isConfirmation ? "Order Confirmation" : "Track Your Pizza! 🍕"}
          </CardTitle>
        </CardHeader>
        <CardContent className="rounded-b-lg space-y-6 p-6 bg-white">
          {isConfirmation && (
            <Alert className="bg-green-100 border-2 border-green-500">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-700 font-bold">
                Awesome!
              </AlertTitle>
              <AlertDescription className="text-green-600">
                Your pizza is on its way to the kitchen! Track its status below.
              </AlertDescription>
            </Alert>
          )}

          {!urlOrderId && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="border-2 border-red-200 focus:border-red-400 focus:ring-red-400"
              />
              <Button
                onClick={() => handleLookup()}
                disabled={loading}
                className="bg-yellow-400 text-red-600 font-bold border-2 border-red-600 hover:bg-yellow-300 transition-all duration-200"
              >
                {loading ? "Loading..." : "Look Up"}
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="border-2 border-red-500">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {order && <OrderDetails order={order} />}

          {order?.status === "pending" && (
            <div className="pt-4 border-t-4 border-yellow-400 text-right">
              <h4 className="font-bold text-red-600 mb-2">Order Actions</h4>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-red-700"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderLookup;

const OrderDetails = ({
  order,
}: {
  order: HiringFrontendTakeHomeOrderResponse;
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-md">Order Details</h3>
        <p className="text-sm text-gray-600">Order #{order.id}</p>
      </div>
      <StatusBadge status={order.status} />
    </div>

    <div className="border-t pt-4">
      <h4 className="font-medium mb-2">Items</h4>
      {order.items.map((item) => (
        <PizzaDetails key={item.id} pizza={item.pizza} />
      ))}
    </div>

    <div className="border-t pt-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Total Amount</span>
        <span className="font-medium">{order.totalAmount.toFixed(2)}</span>
      </div>
    </div>

    {order.type === HiringFrontendTakeHomeOrderType.Delivery && (
      <div className="border-t pt-4">
        <h4 className="font-medium flex items-center gap-2">
          <MapPin size={16} />
          Delivery Address
        </h4>
        <p className="text-sm text-gray-600">
          {order.customer.deliveryAddress?.street}
          <br />
          {order.customer.deliveryAddress?.city},{" "}
          {order.customer.deliveryAddress?.state}{" "}
          {order.customer.deliveryAddress?.zipCode}
        </p>
      </div>
    )}

    <div className="border-t pt-4">
      <h4 className="font-medium">Customer Information</h4>
      <p className="text-sm text-gray-600">
        {order.customer.firstName} {order.customer.lastName}
        <br />
        {order.customer.email}
      </p>
    </div>

    <div className="border-t pt-4 text-sm text-gray-600">
      <p>Order placed: {formatDate(order.createdAt)}</p>
      {order.estimatedDeliveryTime && (
        <p>Estimated delivery: {formatDate(order.estimatedDeliveryTime)}</p>
      )}
    </div>
  </div>
);

// PizzaDetails
const PizzaDetails = ({ pizza }) => (
  <div className="border-4 border-yellow-400 rounded-lg p-4 mb-4 bg-red-50">
    <h4 className="font-bold text-red-600">
      {pizza.type === "specialty" ? "Specialty Pizza" : "Custom Pizza"}
    </h4>
    <p className="text-red-800 font-medium">Size: {pizza.size}</p>
    {pizza.toppings && pizza.toppings.length > 0 && (
      <div className="mt-2">
        <p className="text-red-600 font-bold">Toppings:</p>
        <ul className="text-red-800">
          {pizza.toppings.map((topping, index) => (
            <li key={index} className="font-medium">
              {topping.name} ({topping.quantity})
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="mt-2 flex justify-between items-center border-t-2 border-yellow-400 pt-2">
      <span className="text-red-800 font-medium">
        Quantity: {pizza.quantity}
      </span>
      <span className="font-bold text-red-600">
        ${pizza.totalPrice.toFixed(2)}
      </span>
    </div>
  </div>
);
