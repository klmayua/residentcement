'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Filter, Package, LayoutDashboard, ShoppingCart, BarChart3, Receipt, Settings, CreditCard, Calendar, FileText } from 'lucide-react';

const invoices = [
  { id: 'INV-2024-042', orderId: 'ORD-001', client: 'Skyline Plaza Phase II', project: 'Structural Cement (Bulk)', date: 'Oct 12, 2024', dueDate: 'Oct 22, 2024', amount: 142500, status: 'unpaid' },
  { id: 'INV-2024-041', orderId: 'ORD-002', client: 'Metro Bridge Renovation', project: 'Reinforced Concrete Mix', date: 'Oct 08, 2024', dueDate: 'Oct 18, 2024', amount: 89400, status: 'unpaid' },
  { id: 'INV-2024-040', orderId: 'ORD-003', client: 'Harbor Front Walkway', project: 'Finishing Lime Plaster', date: 'Oct 05, 2024', dueDate: 'Oct 15, 2024', amount: 56200, status: 'paid' },
  { id: 'INV-2024-039', orderId: 'ORD-004', client: 'Downtown Office Complex', project: 'High-Strength Portland', date: 'Oct 02, 2024', dueDate: 'Oct 12, 2024', amount: 210000, status: 'paid' },
  { id: 'INV-2024-038', orderId: 'ORD-005', client: 'Industrial Park Extension', project: 'Mass Concrete Supply', date: 'Sep 28, 2024', dueDate: 'Oct 08, 2024', amount: 450000, status: 'overdue' },
];

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt, active: true },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    paid: 'bg-green-900/30 text-green-500 border-green-900/50',
    unpaid: 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50',
    overdue: 'bg-red-900/30 text-red-400 border-red-900/50',
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

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
            <h2 className="font-headline text-4xl font-bold text-[#e9e1dd] mb-2 italic">Invoices</h2>
            <p className="text-[#a8a29e] max-w-md text-sm">Manage billing and payment status</p>
          </div>
          <button className="px-6 py-3 text-sm font-bold text-[#161311] rounded transition-all hover:opacity-90" style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)', boxShadow: '0 4px 15px rgba(229, 195, 116, 0.3)' }}>
            <Download className="w-4 h-4 inline mr-2" /> Export
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6">
            <p className="text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Outstanding</p>
            <p className="text-3xl font-bold text-[#e5c374]">₦{totalOutstanding.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6">
            <p className="text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Paid (MTD)</p>
            <p className="text-3xl font-bold text-green-500">₦{totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6">
            <p className="text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Overdue</p>
            <p className="text-3xl font-bold text-red-400">₦{invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
              <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-4 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all" />
            </div>
            <div className="flex gap-2">
              {['all', 'paid', 'unpaid', 'overdue'].map((filter) => (
                <button key={filter} onClick={() => setStatusFilter(filter)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${statusFilter === filter ? 'bg-[#e5c374] text-[#161311] border-[#e5c374]' : 'bg-transparent text-[#a8a29e] border-[#4d4540]/30 hover:border-[#e5c374]/50'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#292524]">
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Invoice ID</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Client / Project</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Issue Date</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Due Date</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Amount</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Status</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]/50">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="group hover:bg-[#221f1d]/50 transition-colors">
                    <td className="py-6 px-6 text-sm font-bold text-[#e9e1dd]">{invoice.id}</td>
                    <td className="py-6 px-6">
                      <div className="text-sm text-[#e9e1dd]">{invoice.client}</div>
                      <div className="text-[10px] text-[#7e7667]">{invoice.project}</div>
                    </td>
                    <td className="py-6 px-6 text-sm text-[#a8a29e]">{invoice.date}</td>
                    <td className="py-6 px-6 text-sm text-[#a8a29e]">{invoice.dueDate}</td>
                    <td className="py-6 px-6 text-sm font-bold text-[#e5c374]">₦{invoice.amount.toLocaleString()}</td>
                    <td className="py-6 px-6"><StatusBadge status={invoice.status} /></td>
                    <td className="py-6 px-6 text-right">
                      {invoice.status === 'paid' ? (
                        <button className="border border-[#57534e] text-[#a8a29e] px-4 py-2 text-xs font-bold rounded hover:bg-[#292524] transition-colors">Receipt</button>
                      ) : (
                        <button className="px-4 py-2 text-xs font-bold rounded hover:opacity-90 transition-opacity text-[#161311]" style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}>Pay Now</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
