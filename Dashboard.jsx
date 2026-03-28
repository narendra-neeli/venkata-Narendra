import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, MessageCircle, Calendar, Activity } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import HealthOverviewChart from '@/components/dashboard/HealthOverviewChart';
import PatientRecords from '@/components/dashboard/PatientRecords';

export default function Dashboard() {
  const { user } = useOutletContext();

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-updated_date', 50),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list('-date', 20),
  });

  const { data: healthRecords = [] } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-recorded_date', 50),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const patientCount = users.filter(u => u.role === 'patient').length;
  const activeChats = conversations.filter(c => c.status === 'active').length;
  const upcomingApts = appointments.filter(a => a.status === 'scheduled');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">
          Welcome back, Cosmo
        </h1>
        <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
      </div>
