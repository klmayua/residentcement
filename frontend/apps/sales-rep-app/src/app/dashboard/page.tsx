"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingCart,
  MapPin,
  TrendingUp,
  Plus,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { saveCheckin, getUnsyncedCustomers, getPendingOrders } from "@/lib/db";

const quickActions = [
  { icon: Users, label: "Add Customer", href: "/customers/new", color: "bg-blue-500" },
  { icon: ShoppingCart, label: "New Order", href: "/orders/new", color: "bg-green-500" },
  { icon: MapPin, label: "Check In", href: "#", color: "bg-purple-500", action: "checkin" },
];

const recentActivity = [
  { type: "customer", name: "ABC Construction", time: "2 hours ago", status: "synced" },
  { type: "order", name: "Order #1234", time: "4 hours ago", status: "pending" },
  { type: "checkin", name: "XYZ Blocks", time: "Yesterday", status: "synced" },
];

export default function DashboardPage() {
  const { salesRep, isOnline, setOnline, logout } = useAuthStore();
  const [pendingSync, setPendingSync] = useState({ customers: 0, orders: 0 });
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    // Update online status
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Count unsynced items
    const countUnsynced = async () => {
      const customers = await getUnsyncedCustomers();
      const orders = await getPendingOrders();
      setPendingSync({ customers: customers.length, orders: orders.length });
    };
    countUnsynced();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      // Get GPS location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await saveCheckin({
            id: `checkin_${Date.now()}`,
            customerId: "manual", // In real app, would be selected customer
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString(),
            synced: false,
          });
          alert("Checked in successfully!");
          setIsCheckingIn(false);
        },
        (error) => {
          alert("Location access required for check-in");
          setIsCheckingIn(false);
        }
      );
    } catch (error) {
      alert("Check-in failed");
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-brand-primary text-white p-4 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-white/80">{salesRep?.territory}</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5 text-yellow-300" />
            )}
            <button
              onClick={logout}
              className="text-sm bg-white/20 px-3 py-1 rounded-full"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Pending Sync Warning */}
        {(pendingSync.customers > 0 || pendingSync.orders > 0) && (
          <div className="mt-3 p-2 bg-yellow-400/20 rounded-lg text-sm">
            <p className="font-medium">
              {pendingSync.customers + pendingSync.orders} items pending sync
            </p>
          </div>
        )}
      </header>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-500">New Customers</div>
          <div className="text-xs text-green-500 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +3 this week
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-900">₦2.4M</div>
          <div className="text-sm text-gray-500">Sales This Month</div>
          <div className="text-xs text-green-500 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +15% vs last month
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            action.action === "checkin" ? (
              <button
                key={action.label}
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className={`${action.color} p-4 rounded-xl text-white flex flex-col items-center gap-2 disabled:opacity-50`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-medium">
                  {isCheckingIn ? "Locating..." : action.label}
                </span>
              </button>
            ) : (
              <Link
                key={action.label}
                href={action.href}
                className={`${action.color} p-4 rounded-xl text-white flex flex-col items-center gap-2`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === "customer" ? "bg-blue-100 text-blue-600" :
                  activity.type === "order" ? "bg-green-100 text-green-600" :
                  "bg-purple-100 text-purple-600"
                }`}>
                  {activity.type === "customer" && <Users className="w-5 h-5" />}
                  {activity.type === "order" && <ShoppingCart className="w-5 h-5" />}
                  {activity.type === "checkin" && <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activity.status === "synced"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Targets */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Today's Targets</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Customer Visits</span>
                <span className="font-medium">5/8</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-brand-primary rounded-full" style={{ width: "62.5%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Orders</span>
                <span className="font-medium">3/5</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">New Signups</span>
                <span className="font-medium">2/3</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-purple-500 rounded-full" style={{ width: "66%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
