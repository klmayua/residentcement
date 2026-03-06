"use client";

import { useState } from "react";
import { Search, Filter, CreditCard, Banknote, Smartphone, Calendar, Receipt } from "lucide-react";
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

const payments = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    amount: 450000,
    method: "bank_transfer" as const,
    status: "completed" as const,
    date: "2026-03-05",
    reference: "REF-1234567890",
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    amount: 210000,
    method: "card" as const,
    status: "completed" as const,
    date: "2026-03-04",
    reference: "REF-0987654321",
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    amount: 900000,
    method: "ussd" as const,
    status: "pending" as const,
    date: "2026-03-03",
    reference: "REF-5678901234",
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    amount: 307500,
    method: "bank_transfer" as const,
    status: "failed" as const,
    date: "2026-03-02",
    reference: "REF-4321098765",
  },
];

const methodConfig = {
  bank_transfer: { icon: Banknote, label: "Bank Transfer" },
  card: { icon: CreditCard, label: "Card" },
  ussd: { icon: Smartphone, label: "USSD" },
};

const statusConfig = {
  completed: { variant: "success" as const, label: "Completed" },
  pending: { variant: "warning" as const, label: "Pending" },
  failed: { variant: "error" as const, label: "Failed" },
  refunded: { variant: "info" as const, label: "Refunded" },
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Payments</h1>
          <p className="text-cement-600">Manage and track payment transactions</p>
        </div>
        <Button>
          <Receipt className="w-4 h-4 mr-2" />
          Payment Report
        </Button>
      </div>

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
              variant={methodFilter === "bank_transfer" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter("bank_transfer")}
            >
              Bank Transfer
            </Button>
            <Button
              variant={methodFilter === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter("card")}
            >
              Card
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const method = methodConfig[payment.method];
                  const status = statusConfig[payment.status];
                  const IconComponent = method.icon;
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">#{payment.id}</div>
                      </TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {method.label}
                        </div>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}