'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Play, Pause } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import {
  useGetAttendanceMachinesQuery,
  useSyncAttendanceMachineMutation,
} from '@/store/services/attendanceApi';

export default function RealTimeSync() {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncProgress, setSyncProgress] = useState(0);

  const { data: machinesData, refetch } = useGetAttendanceMachinesQuery({});
  const [syncMachine] = useSyncAttendanceMachineMutation();

  const machines = machinesData?.data || [];

  useEffect(() => {
    if (autoSyncEnabled) {
      const interval = setInterval(() => {
        syncAllMachines();
      }, 300000); // Sync every 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoSyncEnabled]);

  const syncAllMachines = async () => {
    setSyncStatus('syncing');
    setSyncProgress(0);

    for (let i = 0; i < machines.length; i++) {
      try {
        await syncMachine(machines[i]._id).unwrap();
        setSyncProgress(((i + 1) / machines.length) * 100);
      } catch (error) {
        console.error(`Error syncing machine ${machines[i].name}:`, error);
      }
    }

    setLastSyncTime(new Date());
    setSyncStatus(machines.length > 0 ? 'success' : 'idle');
    refetch();
  };

  const handleManualSync = () => {
    syncAllMachines();
  };

  const toggleAutoSync = () => {
    setAutoSyncEnabled(!autoSyncEnabled);
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Real-Time Attendance Sync</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Automatic sync from attendance machines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={autoSyncEnabled ? 'success' : 'default'} size="sm">
            {autoSyncEnabled ? 'Auto-sync ON' : 'Auto-sync OFF'}
          </Badge>
          <button
            onClick={toggleAutoSync}
            className={`p-2 rounded-lg transition-colors ${
              autoSyncEnabled
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {autoSyncEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Sync Status */}
      <div className={`p-4 rounded-lg mb-4 ${
        syncStatus === 'syncing'
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : syncStatus === 'success'
          ? 'bg-green-50 dark:bg-green-900/20'
          : syncStatus === 'error'
          ? 'bg-red-50 dark:bg-red-900/20'
          : 'bg-zinc-50 dark:bg-zinc-800'
      }`}>
        <div className="flex items-center gap-3">
          {syncStatus === 'syncing' && (
            <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
          )}
          {syncStatus === 'success' && (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          )}
          {syncStatus === 'error' && (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          {syncStatus === 'idle' && (
            <Clock className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {syncStatus === 'syncing' && 'Syncing attendance data...'}
              {syncStatus === 'success' && 'Sync completed successfully'}
              {syncStatus === 'error' && 'Sync failed'}
              {syncStatus === 'idle' && 'Ready to sync'}
            </p>
            {lastSyncTime && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Last sync: {lastSyncTime.toLocaleString()}
              </p>
            )}
          </div>
          {syncStatus === 'syncing' && (
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(syncProgress)}%
            </span>
          )}
        </div>
        {syncStatus === 'syncing' && (
          <div className="mt-3 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Machines List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Connected Machines ({machines.length})
          </p>
          <Button variant="ghost" size="sm" onClick={handleManualSync} disabled={syncStatus === 'syncing'}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
        {machines.length === 0 ? (
          <div className="text-center py-4 text-sm text-zinc-500 dark:text-zinc-400">
            No machines configured. Add machines in the settings.
          </div>
        ) : (
          <div className="space-y-2">
            {machines.map((machine: any) => (
              <div
                key={machine._id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    machine.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{machine.name}</p>
                    <p className="text-xs text-zinc-500">{machine.ipAddress}:{machine.port}</p>
                  </div>
                </div>
                <Badge variant={machine.status === 'online' ? 'success' : 'error'} size="sm">
                  {machine.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
