'use client';

import { useState } from 'react';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { Download, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MOCK_INVOICES = [
  { id: 'INV-2025-042', order: '#RC-9021', client: 'Skyline Plaza Phase II', project: 'Structural Cement (Bulk) — 200 T', date: 'Mar 24, 2025', due: 'Apr 07, 2025', amount: 142500, status: 'UNPAID' },
  { id: 'INV-2025-041', order: '#RC-8994', client: 'Metro Bridge Renovation', project: 'Hydraulic Lime — 80 T', date: 'Mar 20, 2025', due: 'Apr 03, 2025', amount: 89400, status: 'UNPAID' },
  { id: 'INV-2025-039', order: '#RC-8961', client: 'Apex Constructions', project: 'Rapid-Set Cement — 150 T', date: 'Mar 15, 2025', due: 'Mar 29, 2025', amount: 210000, status: 'OVERDUE' },
  { id: 'INV-2025-037', order: '#RC-8940', client: 'Harbor Front Walkway', project: 'Finishing Lime Plaster — 40 T', date: 'Mar 10, 2025', due: 'Mar 24, 2025', amount: 34000, status: 'PAID' },
  { id: 'INV-2025-033', order: '#RC-8910', client: 'Greenfield Estates', project: 'Type-1 Portland — 300 T', date: 'Mar 01, 2025', due: 'Mar 15, 2025', amount: 287000, status: 'PAID' },
];

const STATUS_CONFIG = {
  UNPAID:  { label: 'Unpaid',  color: 'text-amber-400', dot: 'bg-amber-400', icon: Clock },
  OVERDUE: { label: 'Overdue', color: 'text-red-400',   dot: 'bg-red-400',   icon: AlertCircle },
  PAID:    { label: 'Paid',    color: 'text-green-400', dot: 'bg-green-400', icon: CheckCircle },
};

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = MOCK_INVOICES.filter((inv) => {
    const matchesSearch = !search ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const outstanding = MOCK_INVOICES
    .filter((i) => i.status !== 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <SidebarLayout title="Invoices" subtitle="Payment ledger & outstanding balances">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-px bg-[#292524]/20 mb-8">
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Total Outstanding</p>
          <p className="text-3xl font-headline font-bold text-[#e5c374]">
            ₦{outstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Overdue</p>
          <p className="text-3xl font-headline font-bold text-red-400">
            {MOCK_INVOICES.filter((i) => i.status === 'OVERDUE').length}
          </p>
        </div>
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Paid This Month</p>
          <p className="text-3xl font-headline font-bold text-green-400">
            {MOCK_INVOICES.filter((i) => i.status === 'PAID').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="pl-10 pr-4 py-2.5 bg-[#1c1917] border border-[#292524]/40 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-[#e5c374]/40 transition-colors w-64"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1c1917] border border-[#292524]/40 text-[#a8a29e] text-[10px] font-bold uppercase tracking-widest focus:outline-none"
        >
          <option value="ALL">All</option>
          <option value="UNPAID">Unpaid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1c1917] border border-[#292524]/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#292524]/30">
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Invoice</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Client / Project</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Issue Date</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Due Date</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Amount</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Status</th>
              <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => {
              const cfg = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UNPAID;
              return (
                <tr key={inv.id} className="border-b border-[#292524]/20 hover:bg-[#221f1d]/40 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-[#e9e1dd]">{inv.id}</p>
                    <p className="text-[10px] text-[#57534e]">{inv.order}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-[#e9e1dd]">{inv.client}</p>
                    <p className="text-[10px] text-[#57534e] mt-0.5">{inv.project}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#a8a29e]">{inv.date}</td>
                  <td className={`px-6 py-5 text-sm ${inv.status === 'OVERDUE' ? 'text-red-400 font-semibold' : 'text-[#a8a29e]'}`}>
                    {inv.due}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[#e5c374]">₦{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {inv.status === 'PAID' ? (
                      <button className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#57534e] hover:text-[#a8a29e] transition-colors">
                        <Download className="w-3.5 h-3.5" /> Receipt
                      </button>
                    ) : (
                      <button
                        className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[#161311] hover:opacity-90 transition-opacity"
                        style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
