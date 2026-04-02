'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { Receipt, Search, Download, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const invoices = [
  { id: 'INV-B2B-025', invoiceNumber: 'INV-B2B-025', client: 'Atlantic Construction Ltd', project: 'Portland Cement 42.5R (500 bags)', amount: 2850000, status: 'UNPAID', date: '2025-03-28', dueDate: '2025-04-27' },
  { id: 'INV-B2B-024', invoiceNumber: 'INV-B2B-024', client: 'Highland Developers', project: 'Limestone Cement (250 bags)', amount: 1425000, status: 'UNPAID', date: '2025-03-27', dueDate: '2025-04-26' },
  { id: 'INV-B2B-023', invoiceNumber: 'INV-B2B-023', client: 'Metro Builders Inc', project: 'Blended Cement (600 bags)', amount: 3200000, status: 'PAID', date: '2025-03-25', dueDate: '2025-04-24', paidDate: '2025-03-26' },
  { id: 'INV-B2B-022', invoiceNumber: 'INV-B2B-022', client: 'Summit Contractors', project: 'Type I Portland (400 bags)', amount: 2280000, status: 'PAID', date: '2025-03-22', dueDate: '2025-04-21', paidDate: '2025-03-23' },
  { id: 'INV-B2B-021', invoiceNumber: 'INV-B2B-021', client: 'Unity Construction', project: 'Hydraulic Cement (300 bags)', amount: 1890000, status: 'PAID', date: '2025-03-20', dueDate: '2025-04-19', paidDate: '2025-03-21' },
  { id: 'INV-B2B-020', invoiceNumber: 'INV-B2B-020', client: 'Pinnacle Developers', project: 'Sulphate Resistant Cement (700 bags)', amount: 4550000, status: 'OVERDUE', date: '2025-02-28', dueDate: '2025-03-30' },
];

const statusConfig = {
  PAID: { color: 'text-green-500', bg: 'bg-green-900/20', icon: CheckCircle, label: 'Paid' },
  UNPAID: { color: 'text-amber-500', bg: 'bg-amber-900/20', icon: Clock, label: 'Unpaid' },
  OVERDUE: { color: 'text-red-500', bg: 'bg-red-900/20', icon: AlertCircle, label: 'Overdue' },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'UNPAID' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SidebarLayout title="Invoices" subtitle="Manage payments and invoices">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Total Outstanding</p>
            <p className="text-3xl font-headline font-bold text-amber-500">{formatCurrency(totalOutstanding)}</p>
            <p className="text-xs text-[#57534e] mt-1">{invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE').length} invoices pending</p>
          </div>
          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Total Paid (YTD)</p>
            <p className="text-3xl font-headline font-bold text-green-500">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-[#57534e] mt-1">{invoices.filter(i => i.status === 'PAID').length} invoices paid</p>
          </div>
          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Overdue</p>
            <p className="text-3xl font-headline font-bold text-red-500">
              {formatCurrency(invoices.filter(i => i.status === 'OVERDUE').reduce((sum, i) => sum + i.amount, 0))}
            </p>
            <p className="text-xs text-[#57534e] mt-1">{invoices.filter(i => i.status === 'OVERDUE').length} invoices overdue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-4 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1c1917] border border-[#292524] text-[#a8a29e] text-sm px-4 py-3 focus:outline-none focus:border-[#e5c374]"
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
            <button className="btn-ghost flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-[#1c1917] border border-[#292524]/30 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#292524]/30">
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Invoice</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Description</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Date</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Due Date</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Amount</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Status</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292524]/10">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const StatusIcon = status.icon;

                return (
                  <tr key={invoice.id} className="hover:bg-[#221f1d]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-[#e5c374]" />
                        <span className="text-sm font-medium text-[#e9e1dd]">{invoice.invoiceNumber}</span>
                      </div>
                      <p className="text-xs text-[#57534e] mt-1">{invoice.client}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#57534e]">{invoice.project}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#57534e]">{formatDate(invoice.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${invoice.status === 'OVERDUE' ? 'text-red-500 font-bold' : 'text-[#57534e]'}`}>
                        {formatDate(invoice.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#e5c374]">{formatCurrency(invoice.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[#57534e] hover:text-[#e5c374] transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {(invoice.status === 'UNPAID' || invoice.status === 'OVERDUE') && (
                          <button className="btn-gold text-[10px] py-2 px-4 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
