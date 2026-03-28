import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

export default function NewConversationDialog({ currentUser, onCreated }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Conversation.create(data),
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setOpen(false);
      onCreated?.(conv);
    },
  });

  const isDoctor = currentUser?.role === 'doctor' || currentUser?.role === 'admin';
  const availableUsers = users.filter(u => {
    if (u.email === currentUser?.email) return false;
    return isDoctor ? u.role === 'patient' : (u.role === 'doctor' || u.role === 'admin');
  });

  const startConversation = (otherUser) => {
    const data = isDoctor ? {
      doctor_email: currentUser.email,
      doctor_name: currentUser.full_name,
      patient_email: otherUser.email,
      patient_name: otherUser.full_name,
      status: 'active',
    } : {
      patient_email: currentUser.email,
      patient_name: currentUser.full_name,
      doctor_email: otherUser.email,
      doctor_name: otherUser.full_name,
      status: 'active',
    };
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-xl">
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
 
