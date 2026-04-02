"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Factory,
  CreditCard,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Inventory", href: "/inventory", icon: Boxes },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Production", href: "/production", icon: Factory },
  { name: "Logistics", href: "/logistics", icon: Truck },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Quality", href: "/quality", icon: ShieldCheck },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-cement-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-cement-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-cement-100">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-cement-900 text-sm">Resident Cement</span>
                <span className="block text-[10px] text-brand-secondary font-medium tracking-wider uppercase">ERP</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-cement-500 hover:text-cement-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-primary text-white"
                      : "text-cement-600 hover:bg-cement-100 hover:text-cement-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-cement-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-cement-900">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cement-900 truncate">Admin</p>
                <p className="text-xs text-cement-500 truncate">Super Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-2 py-2.5 mt-2 text-sm text-cement-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-cement-200">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-cement-500 hover:text-cement-700 hover:bg-cement-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-cement-900">
                {navigation.find((item) => isActive(item.href))?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 text-cement-500 hover:text-cement-700 hover:bg-cement-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-cement-600 hover:bg-cement-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-cement-900">AD</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-cement-200 py-1 z-50">
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-cement-700 hover:bg-cement-50">
                        Settings
                      </Link>
                      <hr className="my-1 border-cement-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
