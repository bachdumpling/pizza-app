import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { pizzaApi } from "@/hooks/usePizzaApi";
import { useLocation, useNavigate, useParams } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2, Clock, MapPin } from "lucide-react";
import {
  HiringFrontendTakeHomeOrderResponse,
  HiringFrontendTakeHomeOrderStatus,
  HiringFrontendTakeHomeOrderType,
  OrderItem,
  PizzaTopping,
} from "@/types";
import { formatDate } from "@/lib/utils";

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
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {isConfirmation ? "Order Confirmation" : "Order Lookup"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isConfirmation && (
            <Alert className="bg-green-50">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Order Successfully Placed!</AlertTitle>
              <AlertDescription>
                Your order has been confirmed. You can track your order status
                below.
              </AlertDescription>
            </Alert>
          )}

          {!urlOrderId && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <Button onClick={() => handleLookup()} disabled={loading}>
                {loading ? "Loading..." : "Look Up"}
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {order && <OrderDetails order={order} />}

          {order?.status === "pending" && (
            <div className="pt-4 border-t text-right">
              <h4 className="font-medium mb-2">Order Actions</h4>
              <Button variant="destructive" onClick={handleCancelOrder}>
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
        <span className="font-medium">{order.totalAmount}</span>
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

const StatusBadge = ({
  status,
}: {
  status: HiringFrontendTakeHomeOrderStatus;
}) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    preparing: { color: "bg-blue-100 text-blue-800", icon: Clock },
    ready: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    delivered: { color: "bg-purple-100 text-purple-800", icon: CheckCircle2 },
    cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium gap-2 ${config.color}`}
    >
      <Icon size={14} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Pizza details component
const PizzaDetails = ({ pizza }: { pizza: OrderItem["pizza"] }) => (
  <div className="border rounded-lg p-4 mb-4">
    <h4 className="font-medium">
      {pizza.type === "specialty" ? "Specialty Pizza" : "Custom Pizza"}
    </h4>
    <p className="text-sm text-gray-600">Size: {pizza.size}</p>
    {pizza.toppings && pizza.toppings.length > 0 && (
      <div className="mt-2">
        <p className="text-sm font-medium">Toppings:</p>
        <ul className="text-sm text-gray-600">
          {pizza.toppings.map((topping: PizzaTopping, index: number) => (
            <li key={index}>
              {topping.name} ({topping.quantity})
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="mt-2 flex justify-between items-center">
      <span className="text-sm text-gray-600">Quantity: {pizza.quantity}</span>
      <span className="font-medium">{pizza.totalPrice}</span>
    </div>
  </div>
);
