import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const severityColors = {
  mild: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  moderate: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  severe: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusColors = {
  active: 'bg-primary/10 text-primary',
  monitoring: 'bg-amber-500/10 text-amber-600',
  improving: 'bg-emerald-500/10 text-emerald-600',
  resolved: 'bg-muted text-muted-foreground',
};

export default function ConditionCard({ record }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-heading font-semibold">{record.condition}</h4>
        <Badge variant="outline" className={cn("text-xs", severityColors[record.severity])}>
          {record.severity}
        </Badge>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Badge className={cn("text-xs capitalize", statusColors[record.status])}>
          {record.status}
        </Badge>
        {record.recorded_date && (
          <span className="text-xs text-muted-foreground">{record.recorded_date}</span>
 
