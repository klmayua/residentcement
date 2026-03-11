"use client";

import { useState } from "react";
import { Search, Filter, Plus, Download, MoreVertical, Package, Edit, Trash2 } from "lucide-react";
import { api, formatCurrency } from "@/lib/api";

const mockProducts = [
  { id: "PROD-001", name: "Dangote Cement 42.5R", sku: "DGC-42.5R-50", category: "Portland Cement", basePrice: 4500, stock: 5000, unit: "bag", minOrder: 50, isActive: true, description: "Premium grade cement for general construction" },
  { id: "PROD-002", name: "Dangote Cement 32.5R", sku: "DGC-32.5R-50", category: "Portland Cement", basePrice: 4200, stock: 8000, unit: "bag", minOrder: 50, isActive: true, description: "Standard grade cement for masonry works" },
  { id: "PROD-003", name: "Ashaka Cement 42.5R", sku: "ASH-42.5R-50", category: "Portland Cement", basePrice: 4600, stock: 3000, unit: "bag", minOrder: 50, isActive: true, description: "High strength cement for structural works" },
  { id: "PROD-004", name: "Ashaka Cement 32.5R", sku: "ASH-32.5R-50", category: "Portland Cement", basePrice: 4300, stock: 0, unit: "bag", minOrder: 50, isActive: false, description: "General purpose cement" },
  { id: "PROD-005", name: "Bamburi Cement 42.5R", sku: "BAM-42.5R-50", category: "Portland Cement", basePrice: 4800, stock: 2500, unit: "bag", minOrder: 50, isActive: true, description: "Premium cement from Bamburi" },
  { id: "PROD-006", name: "WAPCO Cement 42.5R", sku: "WAP-42.5R-50", category: "Portland Cement", basePrice: 4400, stock: 6000, unit: "bag", minOrder: 50, isActive: true, description: "Quality cement for construction" },
  { id: "PROD-007", name: "Bulk Cement (Per Ton)", sku: "BULK-TON", category: "Bulk Cement", basePrice: 85000, stock: 500, unit: "ton", minOrder: 1, isActive: true, description: "Bulk cement for large projects" },
  { id: "PROD-008", name: "Cement Bag Empty", sku: "BAG-EMPTY", category: "Packaging", basePrice: 50, stock: 25000, unit: "piece", minOrder: 100, isActive: true, description: "Empty 50kg cement bag" },
];

const categoryConfig: Record<string, { color: string }> = {
  "Portland Cement": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  "Bulk Cement": { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  "Packaging": { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const categories = [...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "in_stock" && product.stock > 0) ||
      (stockFilter === "out_of_stock" && product.stock === 0) ||
      (stockFilter === "low_stock" && product.stock > 0 && product.stock < 500);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalProducts = mockProducts.length;
  const inStockProducts = mockProducts.filter(p => p.stock > 0).length;
  const lowStockProducts = mockProducts.filter(p => p.stock > 0 && p.stock < 500).length;
  const outOfStockProducts = mockProducts.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your product catalog</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{inStockProducts}</p>
            </div>
            <Package className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
            </div>
            <Package className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{product.description}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {product.sku}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryConfig[product.category]?.color}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(product.basePrice)}/{product.unit}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <span className={`text-sm ${product.stock === 0 ? 'text-red-600' : product.stock < 500 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock.toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">{product.unit}s</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {product.minOrder} {product.unit}s
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-1">
                      <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" title="Edit">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredProducts.length} of {mockProducts.length} products
          </div>
          <div className="flex space-x-2">
            <button className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Previous</button>
            <button className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
