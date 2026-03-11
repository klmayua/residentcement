"use client";

import { useState } from "react";
import { Search, Filter, UserPlus, Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api, formatCurrency, formatDate, getStatusColor } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  { name: "Overview", href: "/", icon: "BarChart3" },
  { name: "Customers", href: "/customers", icon: "Users" },
  { name: "Orders", href: "/orders", icon: "ShoppingCart" },
  { name: "Products", href: "/products", icon: "Package" },
  { name: "Payments", href: "/payments", icon: "DollarSign" },
];

const icons: Record<string, any> = {
  BarChart3: require("lucide-react").BarChart3,
  Users: require("lucide-react").Users,
  ShoppingCart: require("lucide-react").ShoppingCart,
  Package: require("lucide-react").Package,
  DollarSign: require("lucide-react").DollarSign,
};

function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = icons[item.icon];
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-900">
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
