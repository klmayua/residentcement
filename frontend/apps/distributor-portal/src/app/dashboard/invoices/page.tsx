"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, Calendar, CreditCard, Package } from "lucide-react";
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

const invoices = [
  {
    id: "INV-001",
    orderId: "ORD-001",
    date: "2026-03-05",
    amount: 450000,
    status: "paid" as const,
    dueDate: "2026-03-10",
  },
  {
    id: "INV-002",
    orderId: "ORD-002",
    date: "2026-03-04",
    amount: 210000,
    status: "paid" as const,
    dueDate: "2026-03-09",
  },
  {
    id: "INV-003",
    orderId: "ORD-003",
    date: "2026-03-03",
    amount: 900000,
    status: "pending" as const,
    dueDate: "2026-03-08",
  },
  {
    id: "INV-004",
    orderId: "ORD-004",
    date: "2026-03-02",
    amount: 307500,
    status: "overdue" as const,
    dueDate: "2026-03-02",
  },
];

const statusConfig = {
  paid: { variant: "success" as const, label: "Paid" },
  pending: { variant: "warning" as const, label: "Pending" },
  overdue: { variant: "error" as const, label: "Overdue" },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Invoices</h1>
          <p className="text-cement-600">Manage and view your invoices</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Invoices
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-cement-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Invoices List</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
                <Input
                  placeholder="Search invoices..."
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const status = statusConfig[invoice.status];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                          #{invoice.id}
                        </Link>
                      </TableCell>
                      <TableCell>{invoice.orderId}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Send
                          </Button>
                        </div>
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