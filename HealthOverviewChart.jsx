import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function HealthOverviewChart({ records }) {
  const chartData = (records || [])
    .filter(r => r.recorded_date)
    .sort((a, b) => new Date(a.recorded_date) - new Date(b.recorded_date))
    .slice(-14)
    .map(r => ({
      date: format(new Date(r.recorded_date), 'MMM d'),
      heartRate: r.heart_rate,
      bp: r.blood_pressure_systolic,
      oxygen: r.oxygen_saturation,
      sugar: r.blood_sugar,
    }));

  if (!chartData.length) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Health Trends</h3>
        <p className="text-muted-foreground text-sm text-center py-12">No health data recorded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="font-heading font-semibold text-lg mb-6">Health Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(198, 70%, 45%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(198, 70%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 60%, 42%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(160, 60%, 42%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid hsl(210, 15%, 90%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }} 
          />
          <Area type="monotone" dataKey="heartRate" name="Heart Rate" stroke="hsl(0, 72%, 55%)" fill="url(#heartGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="bp" name="Blood Pressure" stroke="hsl(198, 70%, 45%)" fill="url(#bpGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="oxygen" name="O₂ Saturation" stroke="hsl(160, 60%, 42%)" fill="url(#oxygenGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
 
