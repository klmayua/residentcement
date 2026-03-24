'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Package, LayoutDashboard, BarChart3, Receipt, Settings, Plus, Minus, Filter, ChevronDown } from 'lucide-react';

const products = [
  { id: '1', name: 'Elite Portland', sku: 'TYPE-GU-001', type: 'Type GU', grade: '42.5R', category: 'Premium', price: 2450, unit: 'bag', inStock: true },
  { id: '2', name: 'Monolith Blocks', sku: 'PRECAST-002', type: 'Pre-Cast', grade: 'N/A', category: 'Standard', price: 11200, unit: 'block', inStock: true },
  { id: '3', name: 'Titanium Grit', sku: 'AGG-003', type: 'Aggregate', grade: 'N/A', category: 'Bulk', price: 8500, unit: 'ton', inStock: true },
  { id: '4', name: 'Hydro-Seal Mix', sku: 'CUSTOM-004', type: 'Custom', grade: '52.5R', category: 'Specialty', price: 0, unit: 'quote', inStock: true },
  { id: '5', name: 'Resident 32.5R', sku: 'STD-005', type: 'Standard', grade: '32.5R', category: 'Standard', price: 1850, unit: 'bag', inStock: true },
  { id: '6', name: 'Eco-Blend Cement', sku: 'ECO-006', type: 'Eco-Friendly', grade: '42.5N', category: 'Premium', price: 3200, unit: 'bag', inStock: false },
];

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/products', label: 'Products', icon: Package, active: true },
  { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateCart = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-[#161311] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161311] border-r border-[#292524]/50 flex flex-col h-screen fixed left-0 top-0 z-40">
        <div className="p-6 mb-2">
          <h1 className="font-headline text-xl text-[#e9e1dd] italic tracking-tight">ResidentCement</h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7e7667] mt-1">Distributor Portal</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${link.active ? 'text-[#e5c374] bg-[#221f1d] border-l-2 border-[#e5c374]' : 'text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917]'}`}>
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#292524]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#e5c374] flex items-center justify-center text-[#161311] font-bold text-sm">JD</div>
            <div>
              <p className="text-sm font-bold text-[#e9e1dd]">John Doe</p>
              <p className="text-[10px] text-[#7e7667] uppercase tracking-tight">Senior Distributor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-headline text-4xl font-bold text-[#e9e1dd] mb-2 italic">Products</h2>
            <p className="text-[#a8a29e] max-w-md text-sm">Browse and order cement products</p>
          </div>
          <Link href="/dashboard/cart">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#4d4540]/30 text-[#a8a29e] rounded hover:border-[#e5c374]/50 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-bold">Cart ({cartCount})</span>
            </button>
          </Link>
        </header>

        {/* Filters */}
        <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-4 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all" />
            </div>
            <div className="flex gap-2">
              {['all', 'Premium', 'Standard', 'Bulk', 'Specialty'].map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${categoryFilter === cat ? 'bg-[#e5c374] text-[#161311] border-[#e5c374]' : 'bg-transparent text-[#a8a29e] border-[#4d4540]/30 hover:border-[#e5c374]/50'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-[#1a1c1c] rounded border border-[#292524]/30 overflow-hidden group hover:border-[#e5c374]/30 transition-all">
              <div className="aspect-square bg-[#221f1d] flex items-center justify-center relative">
                <Package className="w-16 h-16 text-[#4d4540]" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-[#7e7667]">{product.type}</span>
                {!product.inStock && <span className="absolute top-4 right-4 px-2 py-1 text-[9px] uppercase font-bold tracking-tighter rounded border bg-red-900/30 text-red-400 border-red-900/50">Out of Stock</span>}
              </div>
              <div className="p-6">
                <h3 className="font-headline text-xl font-bold text-[#e9e1dd] mb-1">{product.name}</h3>
                <p className="text-sm text-[#7e7667] mb-4">{product.sku}</p>
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#7e7667]">Grade</p>
                    <p className="text-sm font-bold text-[#e9e1dd]">{product.grade}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#7e7667]">Category</p>
                    <p className="text-sm font-bold text-[#e9e1dd]">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#7e7667]">Price / {product.unit}</p>
                    <p className="text-xl font-bold text-[#e5c374]">{product.price > 0 ? `₦${product.price.toLocaleString()}` : 'Quote'}</p>
                  </div>
                  {product.inStock && (
                    cart[product.id] ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCart(product.id, -1)} className="w-8 h-8 border border-[#4d4540]/30 rounded flex items-center justify-center text-[#e5c374] hover:border-[#e5c374] transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center text-sm font-bold text-[#e9e1dd]">{cart[product.id]}</span>
                        <button onClick={() => updateCart(product.id, 1)} className="w-8 h-8 border border-[#4d4540]/30 rounded flex items-center justify-center text-[#e5c374] hover:border-[#e5c374] transition-colors"><Plus className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateCart(product.id, 1)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded text-[#161311] hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}>Add</button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
