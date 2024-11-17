import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { HiringFrontendTakeHomeOrderResponse } from "@/types";
import { pizzaApi } from "@/hooks/usePizzaApi";

function OrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await pizzaApi.getOrderById(orderId);
      setOrder(response.order);
    } catch (err) {
      setError("Order not found:" + err);
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
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <Button onClick={handleLookup} disabled={loading}>
              {loading ? "Loading..." : "Look Up"}
            </Button>
          </div>
          {order && (
            <div>
              <h4 className="font-medium">Order Details</h4>
              <p>
                <span className="font-semibold">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {order.type}
              </p>
              <p>
                <span className="font-semibold">Total Price:</span> $
                {order.totalAmount}
              </p>
            </div>
          )}

          {order.status === "pending" && (
            <div>
              <h4 className="font-medium">Order Actions</h4>
              <Button variant="destructive" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderLookup;
