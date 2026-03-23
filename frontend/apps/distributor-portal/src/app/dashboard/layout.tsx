"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
];

const userMenu = [
  { name: "Profile", href: "/dashboard/profile" },
  { name: "Settings", href: "/dashboard/settings" },
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

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface-container border-r border-outline-variant/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-outline-variant/10">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-on-surface tracking-tight text-lg"
                >
                  Resident Cement
                </span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant"
                >
                  Premium Access
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10 border-r-2 border-primary"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-outline-variant/10 mt-auto">
            <div className="flex items-center gap-3 px-2 py-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center font-bold text-sm"
                style={{ background: "linear-gradient(45deg, #745B17, #C5A55A)" }}
              >
                <span className="text-on-primary">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">
                  John Doe
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate"
                >
                  Senior Distributor
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-20 glass-nav-dark border-b border-outline-variant/10"
        >
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-headline font-bold text-on-surface"
                >
                  {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                </h1>
                <p className="text-xs text-on-surface-variant">
                  Welcome back, John
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* New Order Button */}
              <Button
                size="sm"
                className="hidden sm:flex btn-gold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Order
              </Button>

              {/* Notifications */}
              <button className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: "linear-gradient(45deg, #745B17, #C5A55A)" }}
                  >
                    <span className="text-xs font-bold text-on-primary">JD</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-surface-container rounded border border-outline-variant/10 py-1 z-50 shadow-ambient"
                    >
                      {userMenu.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <hr className="my-1 border-outline-variant/10" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
