import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Video, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Patients() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: records = [] } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-recorded_date', 200),
  });

  const patients = users.filter(u => u.role === 'patient');

  const getPatientConditions = (email) => {
    return records.filter(r => r.patient_email === email && r.status === 'active');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Patients</h1>
        <p className="text-muted-foreground mt-1">{patients.length} registered patients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => {
          const conditions = getPatientConditions(patient.email);
          const initials = patient.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';
          return (
