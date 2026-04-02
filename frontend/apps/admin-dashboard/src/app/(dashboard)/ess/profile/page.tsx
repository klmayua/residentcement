"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Building, Briefcase, Edit, Save } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@residentcement.com",
    phone: "+234 800 123 4567",
    address: "123 Victoria Island, Lagos",
    department: "Operations",
    position: "Operations Manager",
    employeeId: "EMP-2024-001",
    joinedDate: "2024-01-15",
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: API call to update profile
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">My Profile</h1>
          <p className="text-cement-500">View and manage your personal information.</p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-brand-primary mx-auto flex items-center justify-center">
                <span className="text-3xl font-bold text-white">JD</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-cement-900">{formData.firstName} {formData.lastName}</h2>
              <p className="text-cement-500">{formData.position}</p>
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 text-cement-400 mr-2" />
                <span className="text-cement-900">{formData.department}</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 text-cement-400 mr-2" />
                <span className="text-cement-900">Employee ID: {formData.employeeId}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-cement-400 mr-2" />
                <span className="text-cement-900">Joined {formData.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-cement-900 mb-4">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm disabled:bg-cement-50 disabled:text-cement-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm disabled:bg-cement-50 disabled:text-cement-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-cement-300 text-sm bg-cement-50 text-cement-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-cement-300 text-sm disabled:bg-cement-50"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-cement-700 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-cement-400" />
                  <textarea
                    value={formData.address}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-cement-300 text-sm disabled:bg-cement-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-cement-900 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="Emergency contact name"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm disabled:bg-cement-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="Emergency contact phone"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-lg border border-cement-300 text-sm disabled:bg-cement-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
