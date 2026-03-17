"use client";

import { useState } from "react";
import { Search, Filter, Download, Warehouse, Package, AlertTriangle, CheckCircle, MoreVertical, Plus } from "lucide-react";
import { api, formatCurrency } from "@/lib/api";

const mockWarehouses = [
  { id: "WH-001", name: "Lagos Main Warehouse", code: "LAG-MAIN", location: "Ikeja, Lagos", capacity: 50000, currentStock: 35000, manager: "John Doe", isActive: true },
  { id: "WH-002", name: "Abuja Distribution Center", code: "ABJ-DC", location: "Garki, Abuja", capacity: 30000, currentStock: 22000, manager: "Jane Smith", isActive: true },
  { id: "WH-003", name: "Port Harcourt Depot", code: "PH-DEPOT", location: "Trans Amadi, PH", capacity: 25000, currentStock: 18000, manager: "Mike Johnson", isActive: true },
];

const mockInventory = [
  { id: "INV-001", productName: "Dangote Cement 42.5R", sku: "DGC-42.5R-50", warehouse: "Lagos Main Warehouse", quantity: 5000, reserved: 500, available: 4500, reorderLevel: 1000, status: "AVAILABLE" },
  { id: "INV-002", productName: "Dangote Cement 32.5R", sku: "DGC-32.5R-50", warehouse: "Lagos Main Warehouse", quantity: 8000, reserved: 200, available: 7800, reorderLevel: 1500, status: "AVAILABLE" },
  { id: "INV-003", productName: "Ashaka Cement 42.5R", sku: "ASH-42.5R-50", warehouse: "Abuja Distribution Center", quantity: 300, reserved: 0, available: 300, reorderLevel: 500, status: "LOW_STOCK" },
  { id: "INV-004", productName: "Bamburi Cement 42.5R", sku: "BAM-42.5R-50", warehouse: "Port Harcourt Depot", quantity: 0, reserved: 0, available: 0, reorderLevel: 200, status: "OUT_OF_STOCK" },
  { id: "INV-005", productName: "Bulk Cement (Per Ton)", sku: "BULK-TON", warehouse: "Lagos Main Warehouse", quantity: 500, reserved: 50, available: 450, reorderLevel: 100, status: "AVAILABLE" },
];

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  AVAILABLE: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Available", icon: CheckCircle },
  LOW_STOCK: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Low Stock", icon: AlertTriangle },
  OUT_OF_STOCK: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Out of Stock", icon: AlertTriangle },
  RESERVED: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Reserved", icon: Package },
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"inventory" | "warehouses">("inventory");

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const totalStock = mockInventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = mockInventory.filter(item => item.status === "LOW_STOCK").length;
  const outOfStockItems = mockInventory.filter(item => item.status === "OUT_OF_STOCK").length;
  const totalWarehouses = mockWarehouses.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Track stock levels and warehouse operations</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStock.toLocaleString()}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
            </div>
            <Package className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Warehouses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWarehouses}</p>
            </div>
            <Warehouse className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-2 text-sm font-medium ${activeTab === "inventory" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
          >
            Inventory Items
          </button>
          <button
            onClick={() => setActiveTab("warehouses")}
            className={`pb-2 text-sm font-medium ${activeTab === "warehouses" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
          >
            Warehouses
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === "inventory" ? "Search products..." : "Search warehouses..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex space-x-2">
          {activeTab === "inventory" && (
            <>
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="all">All Warehouses</option>
                {mockWarehouses.map(wh => (
                  <option key={wh.id} value={wh.name}>{wh.name}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </>
          )}
        </div>
      </div>

      {activeTab === "inventory" ? (
        <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Warehouse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Reserved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInventory.map((item) => {
                  const StatusIcon = statusConfig[item.status]?.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{item.productName}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.sku}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{item.warehouse}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{item.quantity.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.reserved.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.available.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          {StatusIcon && <StatusIcon className={`mr-2 h-4 w-4 ${item.status === 'AVAILABLE' ? 'text-green-500' : item.status === 'LOW_STOCK' ? 'text-yellow-500' : 'text-red-500'}`} />}
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[item.status]?.color}`}>
                            {statusConfig[item.status]?.label}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockWarehouses.map((warehouse) => (
            <div key={warehouse.id} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{warehouse.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{warehouse.code}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {warehouse.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Warehouse className="mr-2 h-4 w-4" />
                  {warehouse.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Package className="mr-2 h-4 w-4" />
                  {warehouse.currentStock.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(warehouse.currentStock / warehouse.capacity) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((warehouse.currentStock / warehouse.capacity) * 100)}% capacity used
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
