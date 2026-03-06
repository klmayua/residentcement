"use client";

import { useState } from "react";
import { Search, Filter, User, Phone, Mail, Building2, TrendingUp } from "lucide-react";
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

const customers = [
  {
    id: "CUST-001",
    name: "Doe Cement Distributors",
    email: "contact@doecement.com",
    phone: "+2348012345678",
    address: "123 Lagos Road, Lagos",
    tier: "gold" as const,
    creditLimit: 5000000,
    outstandingBalance: 1250000,
    status: "active" as const,
  },
  {
    id: "CUST-002",
    name: "BuildRight Construction",
    email: "info@buildright.com",
    phone: "+2348012345679",
    address: "456 Abeokuta Way, Abeokuta",
    tier: "silver" as const,
    creditLimit: 2500000,
    outstandingBalance: 450000,
    status: "active" as const,
  },
  {
    id: "CUST-003",
    name: "ABC Supplies Ltd",
    email: "admin@abcsupplies.com",
    phone: "+2348012345680",
    address: "789 Port Harcourt Blvd, PH",
    tier: "bronze" as const,
    creditLimit: 1000000,
    outstandingBalance: 0,
    status: "active" as const,
  },
  {
    id: "CUST-004",
    name: "Metro Builders Inc",
    email: "contact@metrobuilders.com",
    phone: "+2348012345681",
    address: "321 Enugu St, Enugu",
    tier: "platinum" as const,
    creditLimit: 10000000,
    outstandingBalance: 3200000,
    status: "active" as const,
  },
];

const tierConfig = {
  bronze: { color: "bg-amber-100 text-amber-800", label: "Bronze" },
  silver: { color: "bg-gray-100 text-gray-800", label: "Silver" },
  gold: { color: "bg-yellow-100 text-yellow-800", label: "Gold" },
  platinum: { color: "bg-blue-100 text-blue-800", label: "Platinum" },
};

const statusConfig = {
  active: { variant: "success" as const, label: "Active" },
  inactive: { variant: "secondary" as const, label: "Inactive" },
  suspended: { variant: "error" as const, label: "Suspended" },
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter;
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Customers</h1>
          <p className="text-cement-600">Manage your customer relationships</p>
        </div>
        <Button>
          <User className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cement-100 rounded-lg">
                <User className="w-6 h-6 text-cement-600" />
              </div>
              <div>
                <p className="text-sm text-cement-500">Total Customers</p>
                <p className="text-2xl font-bold">2,500+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-cement-500">Active Customers</p>
                <p className="text-2xl font-bold">2,450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-cement-500">Credit Outstanding</p>
                <p className="text-2xl font-bold">₦1.2B</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Phone className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-cement-500">Avg. Order Value</p>
                <p className="text-2xl font-bold">₦450K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-cement-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardTitle>Customer List</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
                <Input
                  placeholder="Search customers..."
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
              variant={tierFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTierFilter("all")}
            >
              All Tiers
            </Button>
            <Button
              variant={tierFilter === "bronze" ? "default" : "outline"}
              size="sm"
              onClick={() => setTierFilter("bronze")}
            >
              Bronze
            </Button>
            <Button
              variant={tierFilter === "silver" ? "default" : "outline"}
              size="sm"
              onClick={() => setTierFilter("silver")}
            >
              Silver
            </Button>
            <Button
              variant={tierFilter === "gold" ? "default" : "outline"}
              size="sm"
              onClick={() => setTierFilter("gold")}
            >
              Gold
            </Button>
            <Button
              variant={tierFilter === "platinum" ? "default" : "outline"}
              size="sm"
              onClick={() => setTierFilter("platinum")}
            >
              Platinum
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
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const tier = tierConfig[customer.tier];
                  const status = statusConfig[customer.status];
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-cement-500 text-sm">#{customer.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-cement-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-cement-400" />
                          {customer.phone}
                        </div>
                      </TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>
                        <Badge className={`${tier.color} capitalize`}>{tier.label}</Badge>
                      </TableCell>
                      <TableCell>₦{customer.creditLimit.toLocaleString()}</TableCell>
                      <TableCell>₦{customer.outstandingBalance.toLocaleString()}</TableCell>
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