"use client";

import { useState } from "react";
import {
  Receipt,
  Plus,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Hourglass,
  Search,
  Calendar,
  NairaSign,
} from "lucide-react";

interface ExpenseClaim {
  id: string;
  claimNumber: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "draft" | "pending" | "approved" | "rejected" | "reimbursed";
  receiptUrl?: string;
  submittedOn?: string;
  approvedBy?: string;
}

const mockClaims: ExpenseClaim[] = [
  {
    id: "1",
    claimNumber: "EXP-2026-001",
    category: "Travel",
    description: "Client meeting in Abuja - Flight and hotel",
    amount: 125000,
    date: "2026-03-15",
    status: "pending",
    submittedOn: "2026-03-18",
  },
  {
    id: "2",
    claimNumber: "EXP-2026-002",
    category: "Meals",
    description: "Team lunch with vendors",
    amount: 45000,
    date: "2026-03-10",
    status: "approved",
    submittedOn: "2026-03-12",
    approvedBy: "Finance Manager",
  },
  {
    id: "3",
    claimNumber: "EXP-2026-003",
    category: "Transportation",
    description: "Local transport for site visits",
    amount: 28000,
    date: "2026-02-28",
    status: "reimbursed",
    submittedOn: "2026-03-01",
    approvedBy: "Finance Manager",
  },
  {
    id: "4",
    claimNumber: "EXP-2026-004",
    category: "Office Supplies",
    description: "Printer cartridges and stationery",
    amount: 18500,
    date: "2026-02-20",
    status: "rejected",
    submittedOn: "2026-02-22",
    approvedBy: "Finance Manager",
  },
];

const expenseCategories = [
  "Travel",
  "Meals",
  "Transportation",
  "Office Supplies",
  "Training",
  "Entertainment",
  "Medical",
  "Other",
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ExpensesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    receipt: null as File | null,
  });

  const filteredClaims = mockClaims.filter((claim) => {
    const matchesSearch =
      claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "reimbursed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Hourglass className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-cement-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-cement-100 text-cement-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      reimbursed: "bg-blue-100 text-blue-800",
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to submit expense claim
    setShowCreateModal(false);
  };

  const totalPending = mockClaims
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalReimbursed = mockClaims
    .filter((c) => c.status === "reimbursed")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Expense Claims</h1>
          <p className="text-cement-500">Submit and track expense reimbursements.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Claim
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Pending Claims</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {formatCurrency(totalPending)}
          </p>
          <p className="text-xs text-cement-400 mt-1">
            {mockClaims.filter((c) => c.status === "pending").length} claims under review
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Approved This Month</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {formatCurrency(totalReimbursed)}
          </p>
          <p className="text-xs text-cement-400 mt-1">
            {mockClaims.filter((c) => c.status === "reimbursed").length} claims processed
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">YTD Total</p>
          <p className="mt-1 text-2xl font-bold text-cement-900">
            {formatCurrency(
              mockClaims
                .filter((c) => c.status === "reimbursed" || c.status === "approved")
                .reduce((sum, c) => sum + c.amount, 0)
            )}
          </p>
          <p className="text-xs text-cement-400 mt-1">Total expenses this year</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-cement-300 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="reimbursed">Reimbursed</option>
        </select>
      </div>

      {/* Claims Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-cement-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-cement-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-brand-primary">
                        {claim.claimNumber}
                      </p>
                      <p className="text-xs text-cement-500">{claim.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-cement-100 px-2.5 py-0.5 text-xs font-medium text-cement-800">
                      {claim.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-cement-900">
                    {formatCurrency(claim.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-cement-600">
                      <Calendar className="h-4 w-4 mr-1 text-cement-400" />
                      {new Date(claim.date).toLocaleDateString("en-NG")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(claim.status)}
                      <span
                        className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          claim.status
                        )}`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-cement-400 hover:text-brand-primary">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Claim Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-cement-900 mb-4">Submit Expense Claim</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                  required
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                  placeholder="Enter expense description..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">
                  Receipt Attachment
                </label>
                <div className="border-2 border-dashed border-cement-300 rounded-lg p-4 text-center hover:border-brand-primary transition-colors">
                  <Receipt className="h-8 w-8 text-cement-400 mx-auto mb-2" />
                  <p className="text-sm text-cement-600">
                    Drag and drop or click to upload receipt
                  </p>
                  <p className="text-xs text-cement-400 mt-1">
                    PDF, JPG, or PNG up to 5MB
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-cement-300 text-sm font-medium text-cement-700 hover:bg-cement-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-sm font-medium text-white hover:bg-brand-primary/90"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
