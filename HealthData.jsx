import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, Thermometer, Droplets, Wind, Activity, Scale } from 'lucide-react';
import VitalCard from '@/components/health/VitalCard';
import ConditionCard from '@/components/health/ConditionCard';
import HealthOverviewChart from '@/components/dashboard/HealthOverviewChart';
import AddHealthRecordDialog from '@/components/health/AddHealthRecordDialog';

export default function HealthData() {
  const { user } = useOutletContext();

  const { data: records = [] } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-recorded_date', 100),
  });

  // Get latest record for vitals
  const latest = records[0] || {};

  // Get unique conditions
  const conditions = records.reduce((acc, r) => {
    if (r.condition && !acc.find(c => c.condition === r.condition)) {
      acc.push(r);
    }
    return acc;
  }, []);

  const getBPStatus = (sys) => {
    if (!sys) return null;
    if (sys < 90) return 'low';
    if (sys > 140) return 'high';
    return 'normal';
  };

  const getHRStatus = (hr) => {
    if (!hr) return null;
    if (hr < 60) return 'low';
    if (hr > 100) return 'high';
    return 'normal';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
