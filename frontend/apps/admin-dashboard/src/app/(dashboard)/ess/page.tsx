"use client";

import { useState } from "react";
import {
  User,
  FileText,
  Calendar,
  Receipt,
  Award,
  Clock,
  ChevronRight,
} from "lucide-react";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: "profile",
    title: "My Profile",
    description: "View and update personal information",
    icon: User,
    href: "/ess/profile",
  },
  {
    id: "payslips",
    title: "Payslips",
    description: "View and download salary slips",
    icon: FileText,
    href: "/ess/payslips",
  },
  {
    id: "leave",
    title: "Leave Management",
    description: "Apply for leave and check balances",
    icon: Calendar,
    href: "/ess/leave",
  },
  {
    id: "expenses",
    title: "Expense Claims",
    description: "Submit reimbursement requests",
    icon: Receipt,
    href: "/ess/expenses",
  },
  {
    id: "benefits",
    title: "Benefits",
    description: "Health insurance, pension, and perks",
    icon: Award,
    href: "/ess/benefits",
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "View attendance records and timesheet",
    icon: Clock,
    href: "/ess/attendance",
  },
];

export default function ESSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cement-900">Employee Self-Service</h1>
        <p className="text-cement-500">Manage your HR-related requests and information.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Leave Balance</p>
          <p className="mt-1 text-2xl font-bold text-cement-900">18 days</p>
          <p className="text-xs text-cement-400 mt-1">Annual leave remaining</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Pending Claims</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">2</p>
          <p className="text-xs text-cement-400 mt-1">Under review</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Next Payday</p>
          <p className="mt-1 text-2xl font-bold text-green-600">Apr 25</p>
          <p className="text-xs text-cement-400 mt-1">In 23 days</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Attendance</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">98%</p>
          <p className="text-xs text-cement-400 mt-1">This month</p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className="group rounded-xl border bg-white p-6 shadow-sm hover:shadow-md hover:border-brand-primary/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-cement-900 group-hover:text-brand-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-cement-500 mt-1">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-cement-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-cement-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-cement-200">
          {[
            {
              title: "Leave Application Submitted",
              description: "Annual leave - Apr 15-19, 2026",
              date: "Today, 9:30 AM",
              status: "Pending",
            },
            {
              title: "Expense Claim Approved",
              description: "Travel reimbursement - ₦45,000",
              date: "Yesterday",
              status: "Approved",
            },
            {
              title: "Payslip Generated",
              description: "March 2026 salary slip",
              date: "Mar 25, 2026",
              status: "Available",
            },
          ].map((activity, index) => (
            <div key={index} className="p-4 hover:bg-cement-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cement-900">{activity.title}</p>
                  <p className="text-sm text-cement-500">{activity.description}</p>
                  <p className="text-xs text-cement-400 mt-1">{activity.date}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    activity.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
