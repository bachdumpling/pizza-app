import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
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

const LOCATION_ID = "b-le";

function EmployeeDashboard() {
  const [orders, setOrders] = useState<HiringFrontendTakeHomeOrderResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await pizzaApi.getAllOrders(LOCATION_ID);
      setOrders(response.orders);
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

  const getStatusColor = (status: HiringFrontendTakeHomeOrderStatus) => {
    switch (status) {
      case HiringFrontendTakeHomeOrderStatus.Pending:
        return "bg-yellow-100 text-yellow-800";
      case HiringFrontendTakeHomeOrderStatus.Preparing:
        return "bg-blue-100 text-blue-800";
      case HiringFrontendTakeHomeOrderStatus.Ready:
        return "bg-green-100 text-green-800";
      case HiringFrontendTakeHomeOrderStatus.Delivered:
        return "bg-gray-100 text-gray-800";
      case HiringFrontendTakeHomeOrderStatus.Cancelled:
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Employee Dashboard</CardTitle>
          <CardDescription>View and update customers' orders</CardDescription>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <Table>
              <TableCaption>A list of recent orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  return (
                    <TableRow>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        {order.customer.firstName} {order.customer.lastName}
                      </TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
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
                            order.status ===
                              HiringFrontendTakeHomeOrderStatus.Cancelled ||
                            order.status ===
                              HiringFrontendTakeHomeOrderStatus.Delivered
                          }
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value={HiringFrontendTakeHomeOrderStatus.Pending}
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value={
                                HiringFrontendTakeHomeOrderStatus.Preparing
                              }
                            >
                              Preparing
                            </SelectItem>
                            <SelectItem
                              value={HiringFrontendTakeHomeOrderStatus.Ready}
                            >
                              Ready
                            </SelectItem>
                            <SelectItem
                              value={
                                HiringFrontendTakeHomeOrderStatus.Delivered
                              }
                            >
                              Delivered
                            </SelectItem>
                            <SelectItem
                              value={
                                HiringFrontendTakeHomeOrderStatus.Cancelled
                              }
                            >
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeDashboard;
