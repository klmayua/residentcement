"use client";

import { useState } from "react";
import { Search, Download, Warehouse, Package, AlertTriangle, CheckCircle, Loader2, Plus } from "lucide-react";
import { useInventory, useWarehouses, useLowStock } from "@/hooks/useInventory";
import { formatCurrency } from "@/lib/api";

const statusConfig: Record<string, { color: string; label: string }> = {
  AVAILABLE: { color: "bg-green-100 text-green-800900200", label: "Available" },
  RESERVED: { color: "bg-blue-100 text-blue-800900200", label: "Reserved" },
  IN_TRANSIT: { color: "bg-yellow-100 text-yellow-800900200", label: "In Transit" },
  QUARANTINED: { color: "bg-red-100 text-red-800900200", label: "Quarantined" },
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"inventory" | "warehouses">("inventory");
  const [page, setPage] = useState(1);

  // Fetch data from APIs
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory({
    page,
    limit: 10,
    warehouseId: warehouseFilter !== "all" ? warehouseFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: warehousesData, isLoading: warehousesLoading } = useWarehouses();
  const { data: lowStockData } = useLowStock(100);

  const inventory = inventoryData?.data || [];
  const warehouses = warehousesData?.data || [];
  const lowStockItems = lowStockData?.data || [];
  const pagination = inventoryData?.meta?.pagination;

  // Filter inventory client-side for search
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalAvailable = inventory.reduce((sum, item) => sum + item.availableQuantity, 0);
  const totalReserved = inventory.reduce((sum, item) => sum + item.reservedQuantity, 0);

  const isLoading = inventoryLoading || warehousesLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Inventory Management</h1>
          <p className="text-cement-500">Track stock levels and warehouse operations</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-cement-700 hover:bg-cement-50800200700">
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
        <div className="rounded-xl border bg-white p-4 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Total Stock</p>
              <p className="text-2xl font-bold text-cement-900">{totalStock.toLocaleString()}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Available</p>
              <p className="text-2xl font-bold text-green-600">{totalAvailable.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Warehouses</p>
              <p className="text-2xl font-bold text-cement-900">{warehouses.length}</p>
            </div>
            <Warehouse className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "inventory"
                ? "border-b-2 border-primary text-primary"
                : "text-cement-500 hover:text-cement-700"
            }`}
          >
            Inventory Items
          </button>
          <button
            onClick={() => setActiveTab("warehouses")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "warehouses"
                ? "border-b-2 border-primary text-primary"
                : "text-cement-500 hover:text-cement-700"
            }`}
          >
            Warehouses
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cement-400" />
          <input
            type="text"
            placeholder={activeTab === "inventory" ? "Search products..." : "Search warehouses..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-cement-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none700800"
          />
        </div>
        <div className="flex space-x-2">
          {activeTab === "inventory" && (
            <>
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700800"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700800"
              >
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="QUARANTINED">Quarantined</option>
              </select>
            </>
          )}
        </div>
      </div>

      {activeTab === "inventory" ? (
        <div className="rounded-xl border bg-white shadow-sm800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cement-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Warehouse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Reserved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cement-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-cement-500">
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-cement-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-cement-900">{item.product?.name || "Unknown"}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-600">{item.product?.sku || "-"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{item.warehouse?.name || "-"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{item.quantity.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-600">{item.reservedQuantity.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-cement-900">{item.availableQuantity.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusConfig[item.status]?.color
                          }`}
                        >
                          {statusConfig[item.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-cement-500">
                Showing {(page - 1) * pagination.limit + 1} -{" "}
                {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} items
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-cement-50 disabled:opacity-50700800"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => (pagination.hasMore ? p + 1 : p))}
                  disabled={!pagination.hasMore}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-cement-50 disabled:opacity-50700800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="rounded-xl border bg-white p-6 shadow-sm800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-cement-900">{warehouse.name}</h3>
                  <p className="text-sm text-cement-500">{warehouse.code}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    warehouse.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-cement-100 text-cement-800"
                  }`}
                >
                  {warehouse.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-cement-600">
                  <Warehouse className="mr-2 h-4 w-4" />
                  {warehouse.city}, {warehouse.state}
                </div>
                <div className="flex items-center text-sm text-cement-600">
                  <Package className="mr-2 h-4 w-4" />
                  Capacity: {warehouse.capacity.toLocaleString()} units
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-cement-200700">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: "45%" }} // Placeholder - would calculate from actual data
                  />
                </div>
                <p className="mt-1 text-xs text-cement-500">45% capacity used</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
