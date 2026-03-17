'use client';

import { useQuery } from '@tanstack/react-query';
import { customersApi, ordersApi, productsApi, paymentsApi, inventoryApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { useOrderUpdates, useLowStockAlerts, useWebSocketStatus } from '@/lib/websocket';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [customers, orders, products, payments] = await Promise.all([
        customersApi.list({ limit: 1 }),
        ordersApi.list({ limit: 1 }),
        productsApi.list({ limit: 1 }),
        paymentsApi.list({ limit: 1 }),
      ]);
      return {
        customers: customers.data?.meta?.pagination?.total || 0,
        orders: orders.data?.meta?.pagination?.total || 0,
        products: products.data?.meta?.pagination?.total || 0,
        payments: payments.data?.meta?.pagination?.total || 0,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await ordersApi.list({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
      return response.data?.data || [];
    },
  });

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => {
      const response = await inventoryApi.getLowStock();
      return response.data?.data?.slice(0, 5) || [];
    },
  });

  // Real-time updates via WebSocket
  const orderUpdates = useOrderUpdates();
  const lowStockAlerts = useLowStockAlerts();
  const wsStatus = useWebSocketStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-brand-secondary/40 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Resident Cement Limited" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-brand-primary font-display">Distributor Portal</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* WebSocket Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                {wsStatus === 'connected' ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Live</span>
                  </>
                ) : wsStatus === 'connecting' ? (
                  <>
                    <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />
                    <span className="text-muted-foreground">Connecting...</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-gray-400" />
                    <span className="text-muted-foreground">Offline</span>
                  </>
                )}
              </div>
              <nav className="flex items-center gap-4">
                <a href="/orders" className="text-sm font-medium text-cement-600 hover:text-brand-secondary transition-colors">Orders</a>
                <a href="/products" className="text-sm font-medium text-cement-600 hover:text-brand-secondary transition-colors">Products</a>
                <a href="/customers" className="text-sm font-medium text-cement-600 hover:text-brand-secondary transition-colors">Customers</a>
                <a href="/inventory" className="text-sm font-medium text-cement-600 hover:text-brand-secondary transition-colors">Inventory</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.customers || 0}</div>
              <p className="text-xs text-muted-foreground">Active distributors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.orders || 0}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.products || 0}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(stats?.payments || 0) * 100000}</div>
              <p className="text-xs text-muted-foreground">Total payments processed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Orders */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your distributors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders?.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customer?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-medium">₦{order.total?.toLocaleString()}</span>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No orders yet</p>}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Products needing restock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStock?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">Warehouse: {item.warehouse?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{item.availableQuantity} units</span>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">All stock levels healthy</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a href="/orders/new" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">New Order</p>
                  <p className="text-sm text-muted-foreground">Create order</p>
                </div>
              </a>
              <a href="/customers/new" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">New Customer</p>
                  <p className="text-sm text-muted-foreground">Add distributor</p>
                </div>
              </a>
              <a href="/products/new" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">New Product</p>
                  <p className="text-sm text-muted-foreground">Add product</p>
                </div>
              </a>
              <a href="/quotes/new" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">New Quote</p>
                  <p className="text-sm text-muted-foreground">Create quote</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
