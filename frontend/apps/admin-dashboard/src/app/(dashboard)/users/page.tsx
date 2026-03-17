"use client";

import { Users, UserPlus, Shield, CheckCircle, XCircle, Clock } from "lucide-react";

const userStats = {
  totalUsers: 48,
  activeUsers: 42,
  adminUsers: 5,
  pendingApprovals: 3,
};

const users = [
  { id: "1", name: "Admin User", email: "admin@residentcement.com", role: "ADMIN", status: "ACTIVE", lastLogin: "2026-03-17T08:00:00Z" },
  { id: "2", name: "John Manager", email: "john@residentcement.com", role: "MANAGER", status: "ACTIVE", lastLogin: "2026-03-17T07:30:00Z" },
  { id: "3", name: "Jane Supervisor", email: "jane@residentcement.com", role: "SUPERVISOR", status: "ACTIVE", lastLogin: "2026-03-16T18:00:00Z" },
  { id: "4", name: "Mike Operator", email: "mike@residentcement.com", role: "OPERATOR", status: "INACTIVE", lastLogin: "2026-03-15T09:00:00Z" },
  { id: "5", name: "Sarah Viewer", email: "sarah@residentcement.com", role: "VIEWER", status: "ACTIVE", lastLogin: "2026-03-17T06:00:00Z" },
];

const pendingApprovals = [
  { id: "1", name: "New User", email: "newuser@example.com", requestedRole: "OPERATOR", requestedAt: "2026-03-17T00:00:00Z" },
  { id: "2", name: "Another User", email: "another@example.com", requestedRole: "VIEWER", requestedAt: "2026-03-16T00:00:00Z" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage users, roles, and permissions.</p>
        </div>
        <button className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{userStats.activeUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Users</p>
              <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.adminUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approvals</p>
              <p className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.pendingApprovals}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search users..."
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button className="text-primary hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Approvals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Requested Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingApprovals.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{user.requestedRole}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600">
                          Approve
                        </button>
                        <button className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
