import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Calendar, Video, MessageCircle, MapPin, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeConfig = {
  video_call: { icon: Video, label: 'Video Call', color: 'bg-primary/10 text-primary' },
  chat: { icon: MessageCircle, label: 'Chat', color: 'bg-accent/10 text-accent' },
  in_person: { icon: MapPin, label: 'In Person', color: 'bg-emerald-500/10 text-emerald-600' },
};

const statusConfig = {
  scheduled: 'bg-primary/10 text-primary',
  in_progress: 'bg-amber-500/10 text-amber-600',
  completed: 'bg-emerald-500/10 text-emerald-600',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function Appointments() {
  const { user } = useOutletContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    patient_email: '', patient_name: '', doctor_email: '', doctor_name: '',
    date: '', type: 'video_call', notes: '',
  });
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list('-date', 50),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setDialogOpen(false);
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const selectedUser = users.find(u => u.email === form.patient_email);
    createMutation.mutate({
      ...form,
      patient_name: selectedUser?.full_name || form.patient_email,
      doctor_email: user?.email,
      doctor_name: user?.full_name,
      status: 'scheduled',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your scheduled consultations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Schedule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <Label>Patient</Label>
                <Select value={form.patient_email} onValueChange={v => setForm(p => ({ ...p, patient_email: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === 'patient').map(u => (
                      <SelectItem key={u.id} value={u.email}>{u.full_name || u.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date & Time</Label>
                <Input type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video_call">Video Call</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Appointments list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No appointments scheduled</p>
          </div>
        ) : (
          appointments.map((apt) => {
            const config = typeConfig[apt.type] || typeConfig.video_call;
            const TypeIcon = config.icon;
            return (
              <div key={apt.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", config.color)}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-heading font-semibold">{apt.patient_name || apt.doctor_name}</h3>
                    <Badge className={cn("text-xs capitalize", statusConfig[apt.status])}>
                      {apt.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {apt.date ? format(new Date(apt.date), 'MMM d, yyyy · h:mm a') : 'TBD'}
                    </div>
                    <span className="capitalize">{config.label}</span>
                  </div>
                  {apt.notes && <p className="text-sm text-muted-foreground mt-1">{apt.notes}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
