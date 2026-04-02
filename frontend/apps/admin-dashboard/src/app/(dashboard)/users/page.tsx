"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  Power,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string | null;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export default function UsersPage() {
  const { user: currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "VIEWER",
    department: "OPERATIONS",
  });

  const roles = [
    { value: "SYSTEM_ADMINISTRATOR", label: "System Administrator" },
    { value: "C_LEVEL_EXECUTIVE", label: "C-Level Executive" },
    { value: "DEPARTMENT_MANAGER", label: "Department Manager" },
    { value: "FINANCE_OFFICER", label: "Finance Officer" },
    { value: "OPERATIONS_MANAGER", label: "Operations Manager" },
    { value: "LOGISTICS_COORDINATOR", label: "Logistics Coordinator" },
    { value: "SALES_MANAGER", label: "Sales Manager" },
    { value: "VIEWER", label: "Viewer" },
  ];

  const departments = [
    { value: "EXECUTIVE", label: "Executive" },
    { value: "FINANCE", label: "Finance" },
    { value: "OPERATIONS", label: "Operations" },
    { value: "SALES", label: "Sales" },
    { value: "LOGISTICS", label: "Logistics" },
    { value: "HR", label: "HR" },
    { value: "IT", label: "IT" },
    { value: "QUALITY", label: "Quality" },
    { value: "PRODUCTION", label: "Production" },
  ];

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_tokens")
        ? JSON.parse(localStorage.getItem("auth_tokens")!).accessToken
        : "";

      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (roleFilter) queryParams.append("role", roleFilter);
      if (statusFilter) queryParams.append("status", statusFilter);

      const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, statusFilter]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_tokens")
        ? JSON.parse(localStorage.getItem("auth_tokens")!).accessToken
        : "";

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          role: "VIEWER",
          department: "OPERATIONS",
        });
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("auth_tokens")
        ? JSON.parse(localStorage.getItem("auth_tokens")!).accessToken
        : "";

      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          department: formData.department,
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      const token = localStorage.getItem("auth_tokens")
        ? JSON.parse(localStorage.getItem("auth_tokens")!).accessToken
        : "";

      const endpoint =
        user.status === "ACTIVE" ? "deactivate" : "activate";
      const response = await fetch(
        `${API_BASE_URL}/users/${user.id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("auth_tokens")
        ? JSON.parse(localStorage.getItem("auth_tokens")!).accessToken
        : "";

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: "",
      role: user.role,
      department: user.department || "OPERATIONS",
    });
    setShowEditModal(true);
  };

  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "ACTIVE").length,
    adminUsers: users.filter((u) => u.role === "SYSTEM_ADMINISTRATOR").length,
    pendingApprovals: users.filter((u) => u.status === "PENDING_VERIFICATION")
      .length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">User Management</h1>
          <p className="text-cement-500">
            Manage users, roles, and permissions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cement-500">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-cement-900">
                {userStats.totalUsers}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cement-500">Active Users</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {userStats.activeUsers}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cement-500">Admin Users</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {userStats.adminUsers}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cement-500">
                Pending Approvals
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-600">
                {userStats.pendingApprovals}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-cement-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-cement-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-brand-secondary flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-cement-900">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cement-900">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-cement-100 px-2.5 py-0.5 text-xs font-medium text-cement-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : user.status === "INACTIVE"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-500">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1 text-cement-400 hover:text-brand-primary"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-1 ${
                          user.status === "ACTIVE"
                            ? "text-green-400 hover:text-green-600"
                            : "text-red-400 hover:text-red-600"
                        }`}
                        title={
                          user.status === "ACTIVE" ? "Deactivate" : "Activate"
                        }
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-cement-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-cement-900 mb-4">
              Add New User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  >
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-cement-300 rounded-lg text-sm font-medium text-cement-700 hover:bg-cement-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-primary rounded-lg text-sm font-medium text-white hover:bg-brand-primary/90"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-cement-900 mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-3 py-2 rounded-lg border border-cement-200 bg-cement-50 text-sm text-cement-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cement-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  >
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-cement-300 rounded-lg text-sm font-medium text-cement-700 hover:bg-cement-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-primary rounded-lg text-sm font-medium text-white hover:bg-brand-primary/90"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
