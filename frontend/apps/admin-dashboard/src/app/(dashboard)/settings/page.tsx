"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Database, Mail, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cement-900">System Settings</h1>
        <p className="text-cement-500">Configure system parameters and preferences.</p>
      </div>

      <div className="flex space-x-1 rounded-lg border bg-cement-50 p-1700900">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security", icon: Shield },
          { id: "database", label: "Database", icon: Database },
          { id: "email", label: "Email", icon: Mail },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm800"
                : "text-cement-600 hover:text-cement-900400"
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm800">
        {activeTab === "general" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cement-900">General Settings</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-cement-700">Company Name</label>
                <input
                  type="text"
                  defaultValue="ResidentCement Ltd"
                  className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700">Default Currency</label>
                <select className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900">
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700">Default Timezone</label>
                <select className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900">
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700">Date Format</label>
                <select className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="maintenance" className="rounded border-cement-300" />
              <label htmlFor="maintenance" className="text-sm text-cement-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cement-900">Notification Settings</h3>

            <div className="space-y-4">
              {[
                { id: "orderAlerts", label: "Order Alerts", desc: "Get notified when new orders are placed" },
                { id: "lowStock", label: "Low Stock Alerts", desc: "Get notified when inventory is running low" },
                { id: "paymentAlerts", label: "Payment Alerts", desc: "Get notified for payment events" },
                { id: "systemAlerts", label: "System Alerts", desc: "Get notified for system events" },
              ].map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <input type="checkbox" id={item.id} defaultChecked className="mt-1 rounded border-cement-300" />
                  <div>
                    <label htmlFor={item.id} className="font-medium text-cement-900">{item.label}</label>
                    <p className="text-sm text-cement-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cement-900">Security Settings</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-cement-700">Session Timeout (minutes)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700">Max Login Attempts</label>
                <input
                  type="number"
                  defaultValue="5"
                  className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="2fa" defaultChecked className="rounded border-cement-300" />
                <label htmlFor="2fa" className="text-sm text-cement-700">
                  Require Two-Factor Authentication for Admin Users
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="passwordPolicy" defaultChecked className="rounded border-cement-300" />
                <label htmlFor="passwordPolicy" className="text-sm text-cement-700">
                  Enforce Strong Password Policy
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "database" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cement-900">Database Settings</h3>

            <div className="space-y-4">
              <div className="rounded-lg border border-cement-200 p-4700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-cement-900">Database Backup</h4>
                    <p className="text-sm text-cement-500">Last backup: 2026-03-17 02:00 AM</p>
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                    Backup Now
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-cement-200 p-4700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-cement-900">Auto-Backup Schedule</h4>
                    <p className="text-sm text-cement-500">Daily at 2:00 AM</p>
                  </div>
                  <button className="rounded-lg border border-cement-300 px-4 py-2 text-sm font-medium hover:bg-cement-50700800">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "email" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cement-900">Email Configuration</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-cement-700">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.residentcement.com"
                  className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700">SMTP Port</label>
                <input
                  type="number"
                  defaultValue="587"
                  className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700">From Email</label>
                <input
                  type="email"
                  defaultValue="noreply@residentcement.com"
                  className="mt-1 block w-full rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700900"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="smtpAuth" defaultChecked className="rounded border-cement-300" />
              <label htmlFor="smtpAuth" className="text-sm text-cement-700">
                Enable SMTP Authentication
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="tls" defaultChecked className="rounded border-cement-300" />
              <label htmlFor="tls" className="text-sm text-cement-700">
                Use TLS Encryption
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button className="flex items-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
