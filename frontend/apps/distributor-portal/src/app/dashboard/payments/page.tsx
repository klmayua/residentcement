"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, CreditCard, Banknote, Smartphone, Receipt, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePayments } from "@/lib/payment";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

const methodConfig = {
  card: { icon: CreditCard, label: "Card" },
  bank_transfer: { icon: Banknote, label: "Bank Transfer" },
  ussd: { icon: Smartphone, label: "USSD" },
};

const statusConfig = {
  completed: { variant: "success" as const, label: "Completed" },
  pending: { variant: "warning" as const, label: "Pending" },
  failed: { variant: "error" as const, label: "Failed" },
  refunded: { variant: "info" as const, label: "Refunded" },
};

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { customer, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: payments, isLoading, error } = usePayments(
    customer?.id || user?.id
  );

  if (error) {
    toast.error("Failed to load payments");
  }

  const filteredPayments = payments?.filter((payment) => {
    const matchesSearch =
      searchQuery === "" ||
      payment.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod =
      methodFilter === "all" || payment.method === methodFilter;
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  }) || [];

  const formatCurrency = (amount: number, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Payments</h1>
          <p className="text-cement-600">Manage and track payment transactions</p>
        </div>
        <Button variant="outline">
          <Receipt className="w-4 h-4 mr-2" />
          Payment Report
        </Button>
      </div>

      {reference && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <Badge variant="success">New</Badge>
              <p>
                Payment initiated with reference: <strong>{reference}</strong>. Your
                order will be processed once payment is confirmed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b border-cement-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardTitle>Payment Transactions</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              variant={methodFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter("all")}
            >
              All Methods
            </Button>
            <Button
              variant={methodFilter === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter("card")}
            >
              Card
            </Button>
            <Button
              variant={methodFilter === "bank_transfer" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter("bank_transfer")}
            >
              Bank Transfer
            </Button>
            <Button
              variant={methodFilter === "ussd" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter("ussd")}
            >
              USSD
            </Button>

            <div className="ml-auto flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-cement-500"
                    >
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => {
                    const method =
                      methodConfig[payment.method as keyof typeof methodConfig];
                    const status =
                      statusConfig[payment.status as keyof typeof statusConfig];
                    const IconComponent = method?.icon || CreditCard;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">#{payment.id}</div>
                        </TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {method?.label || payment.method}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                        <TableCell>
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.reference}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status?.variant || "default"}>
                            {status?.label || payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
