import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  HiringFrontendTakeHomeOrderResponse,
  HiringFrontendTakeHomeOrderStatus,
} from "@/types";
import { pizzaApi } from "@/hooks/usePizzaApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "@/lib/utils";
import StatusBadge from "../ui/StatusBadge";

const LOCATION_ID = import.meta.env.VITE_LOCATION_ID;

function EmployeeDashboard() {
  const [orders, setOrders] = useState<HiringFrontendTakeHomeOrderResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await pizzaApi.getAllOrders(LOCATION_ID);
      setOrders(response.orders.sort((a, b) => b.createdAt - a.createdAt));
      setError("");
    } catch (err) {
      setError("Failed to fetch orders" + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: HiringFrontendTakeHomeOrderStatus
  ) => {
    try {
      await pizzaApi.updateOrderStatus(orderId, newStatus);
      // Refresh orders after update
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status" + err);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      <Card className="border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
        <CardHeader className="rounded-t-lg bg-red-600 border-b-4 border-yellow-400">
          <CardTitle className="text-2xl font-rushford tracking-widest leading-none text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            Pizza Command Center 🍕
          </CardTitle>
          <CardDescription className="text-white/90">
            Ship those pizzas
          </CardDescription>
        </CardHeader>

        <CardContent className="rounded-b-lg p-6 bg-white">
          {error && (
            <p className="text-red-500 mb-4 font-bold border-2 border-red-500 p-4 rounded-lg">
              {error}
            </p>
          )}

          <Table>
            <TableHeader>
              <TableRow className="bg-red-100 hover:bg-red-100/80">
                <TableHead className="font-bold text-red-600">
                  Order ID
                </TableHead>
                <TableHead className="font-bold text-red-600">
                  Customer
                </TableHead>
                <TableHead className="font-bold text-red-600">Amount</TableHead>
                <TableHead className="font-bold text-red-600">
                  Date Ordered
                </TableHead>
                <TableHead className="font-bold text-red-600">Status</TableHead>
                <TableHead className="font-bold text-red-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-red-50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {order.customer.firstName} {order.customer.lastName}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(
                          order.id,
                          value as HiringFrontendTakeHomeOrderStatus
                        )
                      }
                      disabled={
                        order.status === "cancelled" ||
                        order.status === "delivered"
                      }
                    >
                      <SelectTrigger className="w-[150px] border-2 border-red-200 bg-white hover:bg-red-50">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-red-200">
                        <SelectItem
                          value={HiringFrontendTakeHomeOrderStatus.Pending}
                        >
                          Pending
                        </SelectItem>
                        <SelectItem
                          value={HiringFrontendTakeHomeOrderStatus.Preparing}
                        >
                          Preparing
                        </SelectItem>
                        <SelectItem
                          value={HiringFrontendTakeHomeOrderStatus.Ready}
                        >
                          Ready
                        </SelectItem>
                        <SelectItem
                          value={HiringFrontendTakeHomeOrderStatus.Delivered}
                        >
                          Delivered
                        </SelectItem>
                        <SelectItem
                          value={HiringFrontendTakeHomeOrderStatus.Cancelled}
                        >
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeDashboard;
