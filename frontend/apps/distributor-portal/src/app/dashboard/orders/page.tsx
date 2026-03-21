"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const orders = [
  {
    id: "ORD-001",
    date: "2026-03-05",
    customer: "Doe Cement Distributors",
    items: "100 bags Resident 42.5R",
    total: 450000,
    status: "delivered",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    date: "2026-03-04",
    customer: "BuildRight Construction",
    items: "50 bags Resident 32.5R",
    total: 210000,
    status: "in_transit",
    paymentStatus: "paid",
  },
  {
    id: "ORD-003",
    date: "2026-03-03",
    customer: "ABC Supplies Ltd",
    items: "200 bags Resident 42.5R",
    total: 900000,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: "ORD-004",
    date: "2026-03-02",
    customer: "Metro Builders",
    items: "75 bags Pozzolana 32.5N",
    total: 307500,
    status: "delivered",
    paymentStatus: "paid",
  },
  {
    id: "ORD-005",
    date: "2026-03-01",
    customer: "Gold Coast Motors",
    items: "150 bags Resident 52.5R",
    total: 780000,
    status: "cancelled",
    paymentStatus: "refunded",
  },
];

const statusConfig = {
  pending: { variant: "warning" as const, label: "Pending", icon: Clock },
  in_transit: { variant: "info" as const, label: "In Transit", icon: Truck },
  delivered: { variant: "success" as const, label: "Delivered", icon: CheckCircle },
  cancelled: { variant: "error" as const, label: "Cancelled", icon: XCircle },
};

const paymentConfig = {
  pending: { variant: "warning" as const, label: "Pending" },
  paid: { variant: "success" as const, label: "Paid" },
  refunded: { variant: "error" as const, label: "Refunded" },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-cement-900">Orders</h2>
          <p className="text-cement-500">Manage and track your orders</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "in_transit" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("in_transit")}
              >
                In Transit
              </Button>
              <Button
                variant={statusFilter === "delivered" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("delivered")}
              >
                Delivered
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={payment.variant}>
                        {payment.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-cement-100">
            <Pagination
              page={currentPage}
              totalPages={Math.ceil(filteredOrders.length / 10)}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-cement-500">Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-cement-500">Status</p>
                  <Badge
                    variant={
                      statusConfig[selectedOrder.status as keyof typeof statusConfig]
                        .variant
                    }
                  >
                    {
                      statusConfig[selectedOrder.status as keyof typeof statusConfig]
                        .label
                    }
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-cement-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-cement-500">Total</p>
                  <p className="font-medium">
                    {formatCurrency(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
            <Link href={`/dashboard/orders/${selectedOrder?.id}`}>
              <Button>View Full Details</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
