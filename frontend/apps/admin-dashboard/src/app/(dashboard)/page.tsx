"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Factory,
  Truck,
  ShoppingCart,
  Package,
  Banknote,
  CheckCircle,
  PointOfSale,
  Wrench,
  Users,
  Settings,
  Bell,
  HelpCircle,
  History,
  TrendingUp,
  TrendingDown,
  Verified,
  Inventory,
  ShoppingBag,
  Build,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/api";

const sidebarModules = [
  { href: "/dashboard", label: "Overview", icon: BarChart3, active: true },
  { href: "/dashboard/production", label: "Production", icon: Factory },
  { href: "/dashboard/logistics", label: "Logistics", icon: Truck },
  { href: "/dashboard/procurement", label: "Procurement", icon: ShoppingCart },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/finance", label: "Finance", icon: Banknote },
  { href: "/dashboard/quality", label: "Quality", icon: CheckCircle },
  { href: "/dashboard/sales", label: "Sales", icon: PointOfSale },
  { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/dashboard/hr", label: "HR", icon: Users },
];

const bottomNav = [
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/logs", label: "Logs", icon: History },
];

export default function MasterERPDashboard() {
  const [period, setPeriod] = useState("month");
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    page: 1,
    limit: 5,
  });

  const displayStats = stats || {
    totalRevenue: 428500000,
    totalOrders: 1248,
    totalCustomers: 856,
    totalProducts: 4,
    revenueChange: 18.4,
    ordersChange: 12.1,
    customersChange: 9.7,
    productsChange: 0,
  };

  const recentOrders = ordersData?.data || [];
  const isLoading = statsLoading || ordersLoading;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full flex flex-col z-50 bg-stone-900 w-64">
        <div className="px-6 py-8">
          <h1 className="font-headline italic text-xl text-amber-600">Resident Cement</h1>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-label mt-1">Industrial ERP</p>
        </div>

        <nav className="flex-1 flex flex-col mt-4">
          {sidebarModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                module.active
                  ? "bg-secondary text-white border-l-4 border-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
              }`}
            >
              <module.icon className="w-5 h-5" />
              <span className="font-label uppercase tracking-widest text-[10px]">{module.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-stone-800">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-6 py-4 text-stone-400 hover:bg-stone-800 hover:text-white transition-all duration-200"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-label uppercase tracking-widest text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top App Bar */}
        <header className="flex justify-between items-center w-full px-10 h-20 bg-stone-950 top-0 z-40 sticky">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-headline tracking-tighter uppercase text-white">Resident Cement</span>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-amber-600 font-bold border-b-2 border-amber-600 pb-1 cursor-default">Status: Operational</span>
              <a className="text-stone-400 font-medium hover:text-white transition-colors" href="#">Global Search</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-stone-800 text-white text-sm px-3 py-2 border-0 focus:ring-1 focus:ring-secondary"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="text-stone-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-stone-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
          </div>
        </header>

        {/* Hero Metric Section */}
        <section className="px-10 py-16 bg-stone-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-6xl lg:text-7xl font-headline font-extrabold tracking-tight text-primary leading-tight">
                Architectural Gravitas.
              </h2>
              <p className="text-secondary font-label uppercase tracking-widest text-sm mt-4">
                Enterprise Resource Planning & Command Center
              </p>
            </div>

            {/* High Performance Bento Grid */}
            <div className="grid grid-cols-12 gap-0 border border-stone-300">
              {/* Main KPI: Production */}
              <div className="col-span-12 lg:col-span-8 bg-primary p-10 lg:p-12 text-white flex flex-col justify-between min-h-[350px]">
                <div>
                  <Factory className="text-secondary w-12 h-12 mb-6" />
                  <h3 className="text-3xl lg:text-4xl font-headline mb-2">Production Pace</h3>
                  <p className="text-stone-400 text-sm max-w-md">
                    Real-time aggregate output across all integrated kilns and grinding units. Currently maintaining optimal thermal efficiency.
                  </p>
                </div>
                <div className="mt-8 flex items-baseline gap-4">
                  <span className="text-7xl lg:text-8xl font-headline font-black">
                    10<span className="text-4xl">Mt</span>
                  </span>
                  <span className="text-secondary flex items-center gap-1 font-label text-sm">
                    <TrendingUp className="w-4 h-4" /
                    +4.2% VS LY
                  </span>
                </div>
              </div>

              {/* Side KPI: Finance */}
              <div className="col-span-12 lg:col-span-4 bg-white p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <DollarSign className="text-primary w-10 h-10 mb-6" />
                  <h3 className="text-2xl font-headline font-bold">Finance Volume</h3>
                </div>
                <div className="mt-8">
                  <span className="text-4xl lg:text-5xl font-headline font-bold block">
                    {isLoading ? "..." : formatCurrency(displayStats.totalRevenue)}
                  </span>
                  <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Total Revenue {period}</p>
                </div>
                {!isLoading && displayStats.revenueChange >= 0 && (
                  <div className="mt-4 flex items-center gap-2 text-green-600 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{displayStats.revenueChange}%</span>
                  </div>
                )}
                <div className="mt-8 pt-8 border-t border-stone-200">
                  <Link
                    href="/dashboard/finance"
                    className="w-full bg-primary text-white py-4 font-label text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors block text-center"
                  >
                    Audit Ledger
                  </Link>
                </div>
              </div>

              {/* Bottom KPI: Safety */}
              <div className="col-span-12 md:col-span-4 bg-secondary p-10 text-white flex flex-col justify-center">
                <Verified className="w-10 h-10 mb-4" />
                <h3 className="font-headline text-xl mb-1">Safety Record</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-headline font-black">428</span>
                  <span className="text-sm font-label uppercase">Days</span>
                </div>
                <p className="text-xs uppercase tracking-widest mt-2 opacity-80">Since Last Lost Time Incident (LTI)</p>
              </div>

              {/* Bottom KPI: Orders */}
              <div className="col-span-12 md:col-span-4 bg-stone-100 p-10 border-x border-stone-200">
                <ShoppingCart className="text-primary w-10 h-10 mb-4" />
                <h3 className="font-headline text-xl mb-1">Active Orders</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-headline font-black">{isLoading ? "..." : displayStats.totalOrders}</span>
                </div>
                <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Total Orders This {period}</p>
                {!isLoading && displayStats.ordersChange >= 0 && (
                  <div className="mt-4 flex items-center gap-2 text-green-600 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{displayStats.ordersChange}%</span>
                  </div>
                )}
              </div>

              {/* Bottom KPI: Customers */}
              <div className="col-span-12 md:col-span-4 bg-stone-200 p-10">
                <Users className="text-primary w-10 h-10 mb-4" />
                <h3 className="font-headline text-xl mb-1">Active Customers</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-headline font-black">{isLoading ? "..." : displayStats.totalCustomers}</span>
                </div>
                <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Total Registered Accounts</p>
                {!isLoading && displayStats.customersChange >= 0 && (
                  <div className="mt-4 flex items-center gap-2 text-green-600 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+{displayStats.customersChange}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Operational Data & Recent Orders */}
        <section className="px-10 py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h3 className="text-4xl font-headline font-bold">Operational Status</h3>
                <div className="h-1 w-24 bg-secondary mt-4" />
              </div>
              <p className="text-stone-500 font-body max-w-sm text-right italic">
                &quot;Strength is not merely in the material, but in the precision of the architecture that binds it.&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Operational Slabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-100 p-6 border-b-4 border-primary">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-label uppercase tracking-widest text-secondary">Inventory</span>
                    <Inventory className="text-stone-400 w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-xl mb-2">Clinker Reserves</h4>
                  <div className="w-full bg-stone-300 h-1 mb-3">
                    <div className="bg-secondary h-full w-[82%]" />
                  </div>
                  <div className="flex justify-between text-xs font-label uppercase tracking-tighter">
                    <span>842,000 Tons</span>
                    <span className="text-secondary">82% Capacity</span>
                  </div>
                </div>

                <div className="bg-stone-100 p-6 border-b-4 border-primary">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-label uppercase tracking-widest text-secondary">Quality</span>
                    <CheckCircle className="text-stone-400 w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-xl mb-2">Batch Pass Rate</h4>
                  <div className="text-3xl font-headline font-bold">99.4%</div>
                  <p className="text-xs text-stone-500 font-body mt-2">Exceeding NIS 444:2003 standards</p>
                </div>

                <div className="bg-stone-100 p-6 border-b-4 border-primary">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-label uppercase tracking-widest text-secondary">Maintenance</span>
                    <Wrench className="text-stone-400 w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-xl mb-2">Kiln Availability</h4>
                  <div className="text-3xl font-headline font-bold mb-2">98.2%</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-primary text-white text-[10px] font-label uppercase">K1: Active</span>
                    <span className="px-2 py-1 bg-primary text-white text-[10px] font-label uppercase">K2: Active</span>
                  </div>
                </div>

                <div className="bg-stone-100 p-6 border-b-4 border-primary">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-label uppercase tracking-widest text-secondary">Procurement</span>
                    <ShoppingBag className="text-stone-400 w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-xl mb-2">Active POs</h4>
                  <div className="text-3xl font-headline font-bold">142</div>
                  <p className="text-xs text-stone-500 font-body mt-2">Total Spend: $1.24B</p>
                </div>
              </div>

              {/* Right: Recent Orders */}
              <div className="bg-stone-100 p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-headline text-2xl">Recent Orders</h4>
                  <Link
                    href="/dashboard/orders"
                    className="text-secondary font-label text-xs uppercase tracking-widest hover:underline"
                  >
                    View All →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-label uppercase tracking-widest text-stone-500">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-label uppercase tracking-widest text-stone-500">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-label uppercase tracking-widest text-stone-500">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-label uppercase tracking-widest text-stone-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-stone-500">Loading...</td>
                        </tr>
                      ) : recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-stone-500">No orders found</td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-stone-200/50">
                            <td className="px-4 py-3 text-sm font-medium text-primary">
                              <Link href={`/dashboard/orders?id=${order.id}`}>{order.orderNumber}</Link>
                            </td>
                            <td className="px-4 py-3 text-sm text-stone-700">{order.customer?.name || order.customerName || "Unknown"}</td>
                            <td className="px-4 py-3 text-sm font-bold">{formatCurrency(order.total)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-[10px] font-label uppercase ${
                                order.status === "completed" ? "bg-green-500 text-white" :
                                order.status === "pending" ? "bg-yellow-500 text-white" :
                                order.status === "processing" ? "bg-secondary text-white" :
                                "bg-stone-400 text-white"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Anchor */}
        <section className="w-full h-[450px] relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1565514020176-db92b788ad87?q=80&w=2070&auto=format&fit=crop"
            alt="Industrial Site"
            fill
            className="object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center p-10">
            <div className="bg-white/10 backdrop-blur-xl p-10 lg:p-12 border border-white/20 max-w-3xl">
              <h3 className="text-3xl lg:text-4xl font-headline text-white mb-4 leading-tight">
                Built on a foundation of structural permanence.
              </h3>
              <p className="text-stone-200 font-body mb-6">
                Resident Cement operations leverage industrial automation and real-time data flow to ensure we don&apos;t just build, we endure.
              </p>
              <Link
                href="/dashboard/production"
                className="inline-block bg-secondary text-white px-8 py-4 font-label text-xs uppercase tracking-widest hover:brightness-110 transition-all"
              >
                View Production Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-10 py-12 bg-stone-950 text-white border-t border-stone-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
            <div>
              <span className="font-headline italic text-2xl text-amber-600 block mb-2">Resident Cement</span>
              <p className="text-stone-500 text-xs max-w-xs font-body">
                © 2024 Resident Cement Industrial Group. All rights reserved. Access authorized for executive staff only.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h5 className="font-label uppercase tracking-widest text-[10px] text-stone-400 mb-4">Resource Center</h5>
                <ul className="space-y-2 text-sm font-body">
                  <li><Link className="hover:text-secondary" href="/dashboard/safety">Safety Protocols</Link></li>
                  <li><Link className="hover:text-secondary" href="/dashboard/logistics">Logistics</Link></li>
                  <li><Link className="hover:text-secondary" href="/dashboard/hr">HR Portal</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-label uppercase tracking-widest text-[10px] text-stone-400 mb-4">System</h5>
                <ul className="space-y-2 text-sm font-body">
                  <li><span className="text-stone-500">v4.8.2-stable</span></li>
                  <li><Link className="hover:text-secondary" href="#">Network Health</Link></li>
                  <li><Link className="hover:text-secondary" href="#">Security Vault</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
