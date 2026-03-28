'use client';

import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const MONTHLY_DATA = [
  { month: 'Oct', volume: 320, revenue: 14400000 },
  { month: 'Nov', volume: 410, revenue: 18450000 },
  { month: 'Dec', volume: 380, revenue: 17100000 },
  { month: 'Jan', volume: 520, revenue: 23400000 },
  { month: 'Feb', volume: 480, revenue: 21600000 },
  { month: 'Mar', volume: 610, revenue: 27450000 },
];

const maxVolume = Math.max(...MONTHLY_DATA.map((d) => d.volume));

const PRODUCT_MIX = [
  { name: 'Type-1 Portland', pct: 68 },
  { name: 'Hydraulic Lime', pct: 18 },
  { name: 'Rapid-Set Cement', pct: 10 },
  { name: 'Other', pct: 4 },
];

export default function AnalyticsPage() {
  const totalVolume = MONTHLY_DATA.reduce((s, d) => s + d.volume, 0);
  const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const latestMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const volumeGrowth = ((latestMonth.volume - prevMonth.volume) / prevMonth.volume * 100).toFixed(1);

  return (
    <SidebarLayout title="Analytics" subtitle="Distribution performance & insights">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#292524]/20 mb-8">
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Total Volume (6M)</p>
          <p className="text-3xl font-headline font-bold text-[#e9e1dd]">{totalVolume.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mt-1">Tonnes</p>
        </div>
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Total Revenue (6M)</p>
          <p className="text-3xl font-headline font-bold text-[#e5c374]">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">This Month Volume</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-headline font-bold text-[#e9e1dd]">{latestMonth.volume}</p>
            <span className={`text-xs font-bold flex items-center gap-0.5 ${Number(volumeGrowth) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Number(volumeGrowth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(Number(volumeGrowth))}%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mt-1">Tonnes vs last month</p>
        </div>
        <div className="bg-[#1c1917] p-7">
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Avg per Tonne</p>
          <p className="text-3xl font-headline font-bold text-[#e9e1dd]">
            ₦{Math.round(totalRevenue / totalVolume).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume Bar Chart */}
        <div className="lg:col-span-2 bg-[#1c1917] border border-[#292524]/30 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-base font-semibold text-[#e9e1dd]">Monthly Volume</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#57534e] mt-1">Tonnes distributed per month</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#57534e]" />
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_DATA.map((d) => {
              const pct = (d.volume / maxVolume) * 100;
              const isLatest = d === latestMonth;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-[#e9e1dd]">{d.volume}</span>
                  <div
                    className="w-full transition-all"
                    style={{
                      height: `${pct}%`,
                      background: isLatest
                        ? 'linear-gradient(to top, #745B17, #e5c374)'
                        : 'rgba(229,195,116,0.15)',
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-[10px] uppercase tracking-widest text-[#57534e]">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Mix */}
        <div className="bg-[#1c1917] border border-[#292524]/30 p-8">
          <h3 className="font-headline text-base font-semibold text-[#e9e1dd] mb-2">Product Mix</h3>
          <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-8">By volume share</p>
          <div className="space-y-5">
            {PRODUCT_MIX.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#a8a29e]">{p.name}</span>
                  <span className="text-sm font-bold text-[#e9e1dd]">{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#292524]">
                  <div
                    className="h-full"
                    style={{
                      width: `${p.pct}%`,
                      background: 'linear-gradient(90deg, #745B17, #e5c374)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[#292524]/30">
            <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-4">Revenue Trend</p>
            <div className="flex items-end gap-1.5 h-16">
              {MONTHLY_DATA.map((d) => {
                const pct = (d.revenue / Math.max(...MONTHLY_DATA.map((m) => m.revenue))) * 100;
                return (
                  <div
                    key={d.month}
                    className="flex-1 transition-all"
                    style={{
                      height: `${pct}%`,
                      background: d === latestMonth ? '#e5c374' : 'rgba(229,195,116,0.2)',
                      minHeight: '2px',
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {MONTHLY_DATA.map((d) => (
                <span key={d.month} className="text-[8px] uppercase tracking-widest text-[#4d4540]">{d.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
