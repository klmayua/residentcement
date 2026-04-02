"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
  Umbrella,
  Heart,
  Stethoscope,
  Baby,
} from "lucide-react";

interface LeaveBalance {
  type: string;
  icon: React.ElementType;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  approvedBy?: string;
}

const leaveBalances: LeaveBalance[] = [
  { type: "Annual Leave", icon: Umbrella, total: 21, used: 3, remaining: 18, color: "bg-blue-500" },
  { type: "Sick Leave", icon: Stethoscope, total: 10, used: 2, remaining: 8, color: "bg-red-500" },
  { type: "Casual Leave", icon: Clock, total: 7, used: 0, remaining: 7, color: "bg-yellow-500" },
  { type: "Parental Leave", icon: Baby, total: 14, used: 0, remaining: 14, color: "bg-green-500" },
  { type: "Compassionate", icon: Heart, total: 5, used: 0, remaining: 5, color: "bg-purple-500" },
];

const mockRequests: LeaveRequest[] = [
  {
    id: "1",
    type: "Annual Leave",
    startDate: "2026-04-15",
    endDate: "2026-04-19",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    appliedOn: "2026-04-02",
  },
  {
    id: "2",
    type: "Sick Leave",
    startDate: "2026-03-10",
    endDate: "2026-03-11",
    days: 2,
    reason: "Medical appointment",
    status: "approved",
    appliedOn: "2026-03-09",
    approvedBy: "HR Manager",
  },
  {
    id: "3",
    type: "Annual Leave",
    startDate: "2026-02-14",
    endDate: "2026-02-16",
    days: 3,
    reason: "Personal time",
    status: "approved",
    appliedOn: "2026-02-01",
    approvedBy: "HR Manager",
  },
];

const leaveTypes = [
  { value: "annual", label: "Annual Leave", days: 21 },
  { value: "sick", label: "Sick Leave", days: 10 },
  { value: "casual", label: "Casual Leave", days: 7 },
  { value: "parental", label: "Parental Leave", days: 14 },
  { value: "compassionate", label: "Compassionate Leave", days: 5 },
];

export default function LeavePage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to submit leave request
    setShowApplyModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Hourglass className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Leave Management</h1>
          <p className="text-cement-500">Apply for leave and track your requests.</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {leaveBalances.map((leave) => {
          const Icon = leave.icon;
          const percentage = (leave.used / leave.total) * 100;
          return (
            <div
              key={leave.type}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${leave.color} bg-opacity-10`}>
                  <Icon className={`h-5 w-5 ${leave.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-2xl font-bold text-cement-900">{leave.remaining}</span>
              </div>
              <p className="text-sm font-medium text-cement-900">{leave.type}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-cement-500">
                <span>{leave.used} used</span>
                <span>{leave.total} total</span>
              </div>
              <div className="mt-2 h-2 bg-cement-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${leave.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave History */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-cement-900">Leave History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {mockRequests.map((request) => (
                <tr key={request.id} className="hover:bg-cement-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-cement-400 mr-3" />
                      <span className="text-sm font-medium text-cement-900">{request.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-900">
                    {new Date(request.startDate).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(request.endDate).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-900">{request.days} days</td>
                  <td className="px-6 py-4 text-sm text-cement-600">{request.reason}</td>
                  <td className="px-6 py-4 text-sm text-cement-500">
                    {new Date(request.appliedOn).toLocaleDateString("en-NG")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span
                        className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-cement-900 mb-4">Apply for Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                  required
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.days} days available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm"
                  placeholder="Enter reason for leave..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-lg border border-cement-300 text-sm font-medium text-cement-700 hover:bg-cement-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-sm font-medium text-white hover:bg-brand-primary/90"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
