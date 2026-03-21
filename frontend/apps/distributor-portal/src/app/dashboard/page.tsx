import Link from "next/link";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Orders",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Products Ordered",
    value: "2,450",
    change: "+8%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Total Spent",
    value: "₦12.5M",
    change: "+23%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Pending Payments",
    value: "₦450K",
    change: "-5%",
    trend: "down",
    icon: CreditCard,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    date: "2026-03-05",
    items: "100 bags Resident 42.5R",
    total: "₦450,000",
    status: "delivered",
  },
  {
    id: "ORD-002",
    date: "2026-03-04",
    items: "50 bags Resident 32.5R",
    total: "₦210,000",
    status: "in_transit",
  },
  {
    id: "ORD-003",
    date: "2026-03-03",
    items: "200 bags Resident 42.5R",
    total: "₦900,000",
    status: "pending",
  },
  {
    id: "ORD-004",
    date: "2026-03-02",
    items: "75 bags Pozzolana",
    total: "₦307,500",
    status: "delivered",
  },
];

const statusConfig = {
  pending: { variant: "warning" as const, label: "Pending", icon: Clock },
  in_transit: { variant: "info" as const, label: "In Transit", icon: Truck },
  delivered: { variant: "success" as const, label: "Delivered", icon: CheckCircle },
  cancelled: { variant: "error" as const, label: "Cancelled", icon: Clock },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cement-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-cement-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-brand-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-cement-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/dashboard/orders"
            className="text-sm text-brand-primary hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-cement-50 rounded-lg hover:bg-cement-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-cement-200">
                      <ShoppingCart className="w-5 h-5 text-cement-500" />
                    </div>
                    <div>
                      <p className="font-medium text-cement-900">{order.id}</p>
                      <p className="text-sm text-cement-500">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-cement-900">{order.total}</p>
                    <p className="text-sm text-cement-500">{order.date}</p>
                  </div>
                  <Badge variant={status.variant}>
                    <status.icon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <Link href="/dashboard/orders/new" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <p className="font-medium text-cement-900">Create New Order</p>
                <p className="text-sm text-cement-500">
                  Place an order for cement products
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <Link href="/dashboard/products" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-brand-secondary" />
              </div>
              <div>
                <p className="font-medium text-cement-900">Browse Products</p>
                <p className="text-sm text-cement-500">
                  View our cement product catalog
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
