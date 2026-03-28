import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const defaultRecord = {
  condition: '',
  severity: 'mild',
  status: 'active',
  heart_rate: '',
  blood_pressure_systolic: '',
  blood_pressure_diastolic: '',
  temperature: '',
  blood_sugar: '',
  oxygen_saturation: '',
  weight: '',
  notes: '',
  recorded_date: new Date().toISOString().split('T')[0],
};

export default function AddHealthRecordDialog({ patientEmail, patientName }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultRecord);
  const queryClient = useQueryClient();

 
