"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Gauge,
  Factory,
  Wrench,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

// Mock real-time IoT sensor data
const temperatureData = [
  { time: "00:00", kiln1: 1420, kiln2: 1415, ambient: 32 },
  { time: "04:00", kiln1: 1430, kiln2: 1425, ambient: 31 },
  { time: "08:00", kiln1: 1450, kiln2: 1440, ambient: 35 },
  { time: "12:00", kiln1: 1460, kiln2: 1455, ambient: 38 },
  { time: "16:00", kiln1: 1450, kiln2: 1440, ambient: 36 },
  { time: "20:00", kiln1: 1440, kiln2: 1430, ambient: 34 },
  { time: "23:59", kiln1: 1435, kiln2: 1425, ambient: 33 },
];

const productionData = [
  { day: "Mon", target: 500, actual: 485, efficiency: 97 },
  { day: "Tue", target: 500, actual: 510, efficiency: 102 },
  { day: "Wed", target: 500, actual: 495, efficiency: 99 },
  { day: "Thu", target: 500, actual: 480, efficiency: 96 },
  { day: "Fri", target: 500, actual: 520, efficiency: 104 },
  { day: "Sat", target: 400, actual: 390, efficiency: 97.5 },
  { day: "Sun", target: 300, actual: 310, efficiency: 103.3 },
];

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "running" | "idle" | "maintenance" | "fault";
  temperature: number;
  vibration: number;
  runtime: number;
  efficiency: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const mockEquipment: Equipment[] = [
  {
    id: "EQ-001",
    name: "Rotary Kiln #1",
    type: "Kiln",
    status: "running",
    temperature: 1435,
    vibration: 2.3,
    runtime: 8760,
    efficiency: 97.5,
    lastMaintenance: "2026-03-15",
    nextMaintenance: "2026-04-15",
  },
  {
    id: "EQ-002",
    name: "Rotary Kiln #2",
    type: "Kiln",
    status: "running",
    temperature: 1425,
    vibration: 2.1,
    runtime: 8540,
    efficiency: 96.8,
    lastMaintenance: "2026-03-20",
    nextMaintenance: "2026-04-20",
  },
  {
    id: "EQ-003",
    name: "Cement Mill #1",
    type: "Mill",
    status: "running",
    temperature: 85,
    vibration: 1.8,
    runtime: 7200,
    efficiency: 98.2,
    lastMaintenance: "2026-03-10",
    nextMaintenance: "2026-04-10",
  },
  {
    id: "EQ-004",
    name: "Cement Mill #2",
    type: "Mill",
    status: "maintenance",
    temperature: 45,
    vibration: 0,
    runtime: 6800,
    efficiency: 0,
    lastMaintenance: "2026-04-01",
    nextMaintenance: "2026-04-08",
  },
  {
    id: "EQ-005",
    name: "Packaging Line A",
    type: "Packaging",
    status: "running",
    temperature: 42,
    vibration: 0.5,
    runtime: 9200,
    efficiency: 99.1,
    lastMaintenance: "2026-03-25",
    nextMaintenance: "2026-04-25",
  },
  {
    id: "EQ-006",
    name: "Packaging Line B",
    type: "Packaging",
    status: "idle",
    temperature: 38,
    vibration: 0,
    runtime: 4500,
    efficiency: 0,
    lastMaintenance: "2026-03-28",
    nextMaintenance: "2026-04-28",
  },
];

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  equipment: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    equipment: "Rotary Kiln #1",
    message: "Temperature exceeds normal operating range (1450 C)",
    timestamp: "2026-04-02 14:30",
    acknowledged: false,
  },
  {
    id: "2",
    severity: "warning",
    equipment: "Cement Mill #1",
    message: "Vibration levels elevated - schedule inspection",
    timestamp: "2026-04-02 13:15",
    acknowledged: false,
  },
  {
    id: "3",
    severity: "info",
    equipment: "Packaging Line A",
    message: "Scheduled maintenance due in 7 days",
    timestamp: "2026-04-02 12:00",
    acknowledged: true,
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    running: "bg-green-100 text-green-800 border-green-200",
    idle: "bg-yellow-100 text-yellow-800 border-yellow-200",
    maintenance: "bg-blue-100 text-blue-800 border-blue-200",
    fault: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status as keyof typeof colors] || colors.idle;
};

const getSeverityColor = (severity: string) => {
  const colors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return colors[severity as keyof typeof colors] || colors.info;
};

export default function ProductionIoTPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runningCount = mockEquipment.filter((e) => e.status === "running").length;
  const maintenanceCount = mockEquipment.filter((e) => e.status === "maintenance").length;
  const faultCount = mockEquipment.filter((e) => e.status === "fault").length;
  const avgEfficiency =
    mockEquipment
      .filter((e) => e.status === "running")
      .reduce((sum, e) => sum + e.efficiency, 0) / runningCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Production IoT Command Center</h1>
          <p className="text-cement-500">Real-time monitoring of production lines and equipment.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800">System Online</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-cement-900">{currentTime.toLocaleTimeString("en-NG")}</p>
            <p className="text-xs text-cement-500">
              {currentTime.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Factory className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-cement-900">{runningCount}/{mockEquipment.length}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Equipment Running</p>
          <p className="text-xs text-green-600 mt-1">{((runningCount / mockEquipment.length) * 100).toFixed(0)}% uptime</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Gauge className="h-8 w-8 text-brand-primary" />
            <span className="text-2xl font-bold text-cement-900">{avgEfficiency.toFixed(1)}%</span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Avg Efficiency</p>
          <p className="text-xs text-cement-400 mt-1">Target: 95%</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Wrench className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-cement-900">{maintenanceCount}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Under Maintenance</p>
          <p className="text-xs text-blue-600 mt-1">Scheduled work in progress</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-cement-900">{faultCount}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Faults Detected</p>
          <p className="text-xs text-red-600 mt-1">Immediate attention required</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-cement-900">Kiln Temperature (C)</h2>
            </div>
            <span className="text-xs text-cement-500">Real-time monitoring</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="colorTemp1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[30, 1500]} />
                <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Legend />
                <Area type="monotone" dataKey="kiln1" name="Kiln #1" stroke="#ef4444" fill="url(#colorTemp1)" />
                <Area type="monotone" dataKey="kiln2" name="Kiln #2" stroke="#f97316" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-cement-900">Daily Production Output (MT)</h2>
            </div>
            <span className="text-xs text-cement-500">This week</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Legend />
                <Bar dataKey="target" name="Target" fill="#d1d5db" />
                <Bar dataKey="actual" name="Actual" fill="#e5c374" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-cement-900">Equipment Status</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center px-3 py-1.5 rounded-lg border border-cement-300 text-sm text-cement-700 hover:bg-cement-50">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {mockEquipment.map((equipment) => (
            <div
              key={equipment.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedEquipment?.id === equipment.id ? "border-brand-primary bg-brand-primary/5" : "border-cement-200"
              }`}
              onClick={() => setSelectedEquipment(equipment)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-cement-900">{equipment.name}</p>
                  <p className="text-xs text-cement-500">{equipment.id}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(equipment.status)}`}>
                  {equipment.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cement-500 flex items-center gap-1">
                    <Thermometer className="h-3 w-3" /> Temp
                  </span>
                  <span className="font-medium text-cement-900">{equipment.temperature}C</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cement-500 flex items-center gap-1">
                    <Wind className="h-3 w-3" /> Vibration
                  </span>
                  <span className="font-medium text-cement-900">{equipment.vibration} mm/s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cement-500 flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Runtime
                  </span>
                  <span className="font-medium text-cement-900">{equipment.runtime}h</span>
                </div>
                {equipment.status === "running" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cement-500">Efficiency</span>
                    <span className="font-medium text-green-600">{equipment.efficiency}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-cement-900">IoT Alerts</h2>
            </div>
            <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              {mockAlerts.filter((a) => !a.acknowledged).length} Unacknowledged
            </span>
          </div>
        </div>
        <div className="divide-y divide-cement-200">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 hover:bg-cement-50 ${!alert.acknowledged ? "bg-yellow-50/50" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${alert.severity === "critical" ? "bg-red-100" : alert.severity === "warning" ? "bg-yellow-100" : "bg-blue-100"}`}>
                  <AlertTriangle className={`h-5 w-5 ${alert.severity === "critical" ? "text-red-600" : alert.severity === "warning" ? "text-yellow-600" : "text-blue-600"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-cement-500">{alert.equipment}</span>
                  </div>
                  <p className="font-medium text-cement-900">{alert.message}</p>
                  <p className="text-xs text-cement-500 mt-1">{alert.timestamp}</p>
                </div>
                {!alert.acknowledged && (
                  <button className="px-3 py-1 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-primary/90">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
