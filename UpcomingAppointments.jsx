import React from 'react';
import { Video, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeIcons = {
  video_call: Video,
  chat: MessageCircle,
  in_person: MapPin,
};

const typeLabels = {
  video_call: 'Video Call',
  chat: 'Chat',
  in_person: 'In Person',
};

export default function UpcomingAppointments({ appointments }) {
  if (!appointments?.length) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Upcoming Appointments</h3>
        <p className="text-muted-foreground text-sm text-center py-8">No upcoming appointments</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="font-heading font-semibold text-lg mb-4">Upcoming Appointments</h3>
      <div className="space-y-3">
        {appointments.slice(0, 5).map((apt) => {
 
