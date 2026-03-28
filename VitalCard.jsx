import React from 'react';
import { cn } from '@/lib/utils';

export default function VitalCard({ icon: Icon, label, value, unit, status, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-heading font-bold">{value ?? '—'}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {status && (
        <span className={cn(
          "inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full",
          status === 'normal' ? 'bg-emerald-500/10 text-emerald-600' :
          status === 'high' ? 'bg-destructive/10 text-destructive' :
          status === 'low' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'
        )}>
          {status}
        </span>
 
