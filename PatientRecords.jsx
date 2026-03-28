import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const severityColors = {
  mild: 'bg-emerald-500/10 text-emerald-600',
  moderate: 'bg-amber-500/10 text-amber-600',
  severe: 'bg-orange-500/10 text-orange-600',
  critical: 'bg-destructive/10 text-destructive',
};

export default function PatientRecords({ records, users }) {
  const patients = users.filter(u => u.role === 'patient');

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg">Patient Records</h3>
        <Link to="/patients">
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {patients.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No patient records yet</p>
      ) : (
        <div className="space-y-3">
          {patients.slice(0, 6).map((patient) => {
            const patientRecords = records.filter(r => r.patient_email === patient.email);
            const activeConditions = patientRecords.filter(r => r.status === 'active' || r.status === 'monitoring');
            const latest = patientRecords[0];
            const initials = patient.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

            return (
              <div key={patient.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{patient.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {latest?.severity && (
                    <Badge className={cn("text-xs", severityColors[latest.severity])}>
                      {latest.severity}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{activeConditions.length} conditions</span>
                </div>
              </div>
            );
          })}
 
