'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/store/cart';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Type-1 Portland Cement',
    grade: 'CEM I 42.5R',
    description: 'Our flagship general-purpose cement. Suitable for all structural, civil, and commercial applications. Meets EN 197-1 international standards.',
    pricePerTonne: 45000,
    minOrder: 10,
    availability: 'IN_STOCK',
    stock: 4200,
  },
  {
    id: '2',
    name: 'Hydraulic Lime',
    grade: 'NHL 3.5',
    description: 'Natural hydraulic lime for restoration, conservation, and high-performance masonry work. Breathable and durable.',
    pricePerTonne: 62000,
    minOrder: 5,
    availability: 'IN_STOCK',
    stock: 850,
  },
  {
    id: '3',
    name: 'Rapid-Set Cement',
    grade: 'CEM I 52.5R',
    description: 'High early-strength cement for fast-track construction, precast elements, and cold-weather applications.',
    pricePerTonne: 58000,
    minOrder: 20,
    availability: 'IN_STOCK',
    stock: 1600,
  },
  {
    id: '4',
    name: 'Sulphate-Resistant Cement',
    grade: 'CEM I SR-OPC',
    description: 'Specially formulated for foundation work, basement structures, and environments exposed to ground sulphates.',
    pricePerTonne: 52000,
    minOrder: 15,
    availability: 'LOW_STOCK',
    stock: 120,
  },
  {
    id: '5',
    name: 'White Portland Cement',
    grade: 'CEM I 52.5 N (White)',
    description: 'Premium white cement for architectural finishes, decorative concrete, terrazzo, and tile grout.',
    pricePerTonne: 75000,
    minOrder: 5,
    availability: 'OUT_OF_STOCK',
    stock: 0,
  },
];

const AVAILABILITY_CONFIG = {
  IN_STOCK:     { label: 'In Stock',     color: 'text-green-400', dot: 'bg-green-400' },
  LOW_STOCK:    { label: 'Low Stock',    color: 'text-amber-400', dot: 'bg-amber-400' },
  OUT_OF_STOCK: { label: 'Out of Stock', color: 'text-[#57534e]', dot: 'bg-[#57534e]' },
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const addItem = useCartStore((s) => s.addItem);

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await productsApi.list({ limit: 20 });
      return res.data?.data || MOCK_PRODUCTS;
    },
  });

  const filtered = (products || MOCK_PRODUCTS).filter((p: any) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.grade?.toLowerCase().includes(search.toLowerCase())
  );

  const setQty = (id: string, val: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, val) }));

  return (
    <SidebarLayout title="Products" subtitle="Cement catalogue & pricing">
      {/* Search */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2.5 bg-[#1c1917] border border-[#292524]/40 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-[#e5c374]/40 transition-colors w-72"
          />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-[#57534e]">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#292524]/20">
        {filtered.map((product: any) => {
          const avail = AVAILABILITY_CONFIG[product.availability as keyof typeof AVAILABILITY_CONFIG] || AVAILABILITY_CONFIG.IN_STOCK;
          const qty = quantities[product.id] || product.minOrder || 1;
          const isAvailable = product.availability !== 'OUT_OF_STOCK';

          return (
            <div key={product.id} className="bg-[#1c1917] p-7 flex flex-col gap-5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest mb-2 ${avail.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                    {avail.label} {product.stock ? `· ${product.stock.toLocaleString()} T` : ''}
                  </div>
                  <h3 className="font-headline text-lg font-semibold text-[#e9e1dd]">{product.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#e5c374] mt-1">{product.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-headline font-bold text-[#e5c374]">
                    ₦{product.pricePerTonne?.toLocaleString()}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-[#57534e]">per tonne</p>
                </div>
              </div>

              <p className="text-sm text-[#7e7667] leading-relaxed">{product.description}</p>

              {/* Order controls */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#292524]/30">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Quantity (T)</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(product.id, qty - (product.minOrder || 1))}
                      className="w-8 h-8 border border-[#292524] text-[#a8a29e] hover:border-[#57534e] hover:text-[#e9e1dd] transition-colors flex items-center justify-center">
                      −
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(product.id, parseInt(e.target.value) || 0)}
                      min={product.minOrder || 1}
                      className="w-20 text-center py-1.5 bg-[#221f1d] border border-[#292524]/40 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374]/40"
                    />
                    <button onClick={() => setQty(product.id, qty + (product.minOrder || 1))}
                      className="w-8 h-8 border border-[#292524] text-[#a8a29e] hover:border-[#57534e] hover:text-[#e9e1dd] transition-colors flex items-center justify-center">
                      +
                    </button>
                  </div>
                  {product.minOrder && (
                    <p className="text-[9px] text-[#4d4540] mt-1">Min: {product.minOrder} T</p>
                  )}
                </div>
                <div className="flex-1 flex flex-col items-end gap-2">
                  <p className="text-sm font-bold text-[#e9e1dd]">
                    ₦{(qty * (product.pricePerTonne || 0)).toLocaleString()}
                  </p>
                  <button
                    disabled={!isAvailable}
                    onClick={() => isAvailable && addItem({ id: `cart-${product.id}`, productId: product.id, name: product.name, sku: product.grade || product.id, price: product.pricePerTonne, quantity: qty, unit: 'tonne' })}
                    className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#161311] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {isAvailable ? 'Add to Order' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SidebarLayout>
  );
}
