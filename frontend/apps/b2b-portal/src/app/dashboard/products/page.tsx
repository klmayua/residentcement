'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Search, Package, CheckCircle, AlertCircle, XCircle, Plus } from 'lucide-react';

const products = [
  { id: '1', name: 'Limestone Cement 42.5R', description: 'High-strength cement for structural applications', price: 5700, stock: 5000, category: 'Structural', sku: 'RC-LC425-50KG', leadTime: '24h', status: 'IN_STOCK' as const, minOrder: 100 },
  { id: '2', name: 'Ordinary Portland Cement', description: 'General purpose cement for construction', price: 5500, stock: 3500, category: 'General', sku: 'RC-OPC-50KG', leadTime: '24h', status: 'IN_STOCK' as const, minOrder: 100 },
  { id: '3', name: 'Portland Limestone Blend', description: 'Eco-friendly blended cement', price: 5300, stock: 1200, category: 'Eco', sku: 'RC-PLB-50KG', leadTime: '48h', status: 'LOW_STOCK' as const, minOrder: 100 },
  { id: '4', name: 'Rapid Hardening Cement', description: 'Fast-setting cement for urgent projects', price: 6200, stock: 800, category: 'Specialty', sku: 'RC-RHC-50KG', leadTime: '48h', status: 'LOW_STOCK' as const, minOrder: 50 },
  { id: '5', name: 'Sulphate Resistant Cement', description: 'For coastal and aggressive environments', price: 6500, stock: 2500, category: 'Specialty', sku: 'RC-SRC-50KG', leadTime: '48h', status: 'IN_STOCK' as const, minOrder: 100 },
  { id: '6', name: 'White Portland Cement', description: 'Premium white cement for architectural use', price: 8500, stock: 0, category: 'Premium', sku: 'RC-WPC-50KG', leadTime: '72h', status: 'OUT_OF_STOCK' as const, minOrder: 50 },
];

const statusConfig = {
  IN_STOCK: { color: 'text-green-500', bg: 'bg-green-900/20', border: 'border-green-500/30', icon: CheckCircle, label: 'In Stock' },
  LOW_STOCK: { color: 'text-amber-500', bg: 'bg-amber-900/20', border: 'border-amber-500/30', icon: AlertCircle, label: 'Low Stock' },
  OUT_OF_STOCK: { color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/30', icon: XCircle, label: 'Out of Stock' },
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { addItem, items } = useCartStore();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: product.minOrder,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarLayout title="Products" subtitle="Browse and order cement products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-4 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1c1917] border border-[#292524] text-[#a8a29e] text-sm px-4 py-3 focus:outline-none focus:border-[#e5c374]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Link href="/dashboard/orders/cart">
            <button className="btn-ghost flex items-center gap-2 relative">
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e5c374] text-[#161311] text-xs font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const status = statusConfig[product.status];
            const StatusIcon = status.icon;

            return (
              <div key={product.id} className="bg-[#1c1917] border border-[#292524]/30 group hover:border-[#e5c374]/20 transition-colors">
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-[#221f1d] to-[#292524] flex items-center justify-center border-b border-[#292524]/30"
                >
                  <Package className="w-16 h-16 text-[#4d4540]" />
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-[#57534e] uppercase tracking-widest">{product.category}</span>
                      <h3 className="text-lg font-headline font-bold text-[#e9e1dd] mt-1">{product.name}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${status.bg} ${status.color} ${status.border} border`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-[#57534e] mb-4">{product.description}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                    <div className="bg-[#221f1d] p-3">
                      <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-1">SKU</p>
                      <p className="text-[#a8a29e] font-mono text-xs">{product.sku}</p>
                    </div>
                    <div className="bg-[#221f1d] p-3">
                      <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-1">Lead Time</p>
                      <p className="text-[#a8a29e]">{product.leadTime}</p>
                    </div>
                    <div className="bg-[#221f1d] p-3">
                      <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-1">Min Order</p>
                      <p className="text-[#a8a29e]">{product.minOrder} bags</p>
                    </div>
                    <div className="bg-[#221f1d] p-3">
                      <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-1">Stock</p>
                      <p className={`${product.stock < 500 ? 'text-amber-500' : 'text-[#a8a29e]'}`}>{product.stock.toLocaleString()} bags</p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#292524]/30">
                    <div>
                      <p className="text-[10px] text-[#57534e] uppercase tracking-widest">Price per bag</p>
                      <p className="text-2xl font-headline font-bold text-[#e5c374]">{formatCurrency(product.price)}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.status === 'OUT_OF_STOCK'}
                      className="btn-gold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
