'use client';

import { useState } from 'react';
import { Plus, RefreshCw, Wifi, WifiOff, Settings, Trash2, Play } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Badge from '@/components/ui/Badge/Badge';
import {
  useGetAttendanceMachinesQuery,
  useAddAttendanceMachineMutation,
  useUpdateAttendanceMachineMutation,
  useDeleteAttendanceMachineMutation,
  useSyncAttendanceMachineMutation,
  useTestMachineConnectionMutation,
} from '@/store/services/attendanceApi';

export default function AttendanceMachinesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [testConnectionData, setTestConnectionData] = useState<any>(null);

  const { data: machinesData, isLoading, refetch } = useGetAttendanceMachinesQuery({});
  const [addMachine] = useAddAttendanceMachineMutation();
  const [updateMachine] = useUpdateAttendanceMachineMutation();
  const [deleteMachine] = useDeleteAttendanceMachineMutation();
  const [syncMachine] = useSyncAttendanceMachineMutation();
  const [testConnection] = useTestMachineConnectionMutation();

  const machines = machinesData?.data || [];

  const handleAddMachine = async (data: any) => {
    try {
      await addMachine(data).unwrap();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };

  const handleUpdateMachine = async (data: any) => {
    try {
      await updateMachine({ id: selectedMachine._id, ...data }).unwrap();
      setIsModalOpen(false);
      setSelectedMachine(null);
      refetch();
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  };

  const handleDeleteMachine = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await deleteMachine(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Error deleting machine:', error);
      }
    }
  };

  const handleSyncMachine = async (id: string) => {
    try {
      await syncMachine(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Error syncing machine:', error);
    }
  };

  const handleTestConnection = async (data: any) => {
    try {
      const result = await testConnection(data).unwrap();
      setTestConnectionData(result);
    } catch (error) {
      console.error('Error testing connection:', error);
      setTestConnectionData({ success: false, message: 'Connection failed' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Attendance Machines</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage and monitor biometric attendance devices
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setSelectedMachine(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Machine
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          Loading machines...
        </div>
      ) : machines.length === 0 ? (
        <Card className="p-8 text-center">
          <WifiOff className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">No Machines Configured</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Add your first attendance machine to start syncing attendance data
          </p>
          <Button variant="primary" size="sm" onClick={() => { setSelectedMachine(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Machine
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine: any) => (
            <Card key={machine._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${machine.status === 'online' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {machine.status === 'online' ? <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" /> : <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{machine.name}</h3>
                    <p className="text-sm text-zinc-500">{machine.brand} {machine.model}</p>
                  </div>
                </div>
                <Badge variant={machine.status === 'online' ? 'success' : 'error'} size="sm">
                  {machine.status}
                </Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">IP Address</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{machine.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Port</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{machine.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{machine.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Last Sync</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {machine.lastSync ? new Date(machine.lastSync).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSyncMachine(machine._id)}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedMachine(machine); setIsModalOpen(true); }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteMachine(machine._id)}
                  className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <MachineModal
          machine={selectedMachine}
          onClose={() => { setIsModalOpen(false); setSelectedMachine(null); }}
          onSave={selectedMachine ? handleUpdateMachine : handleAddMachine}
          onTestConnection={handleTestConnection}
          testResult={testConnectionData}
        />
      )}
    </div>
  );
}

function MachineModal({ machine, onClose, onSave, onTestConnection, testResult }: any) {
  const [formData, setFormData] = useState({
    name: machine?.name || '',
    brand: machine?.brand || 'ZKTeco',
    model: machine?.model || 'K40',
    ipAddress: machine?.ipAddress || '',
    port: machine?.port || '4370',
    location: machine?.location || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTest = () => {
    onTestConnection(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {machine ? 'Edit Machine' : 'Add New Machine'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Machine Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Brand</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              >
                <option value="ZKTeco">ZKTeco</option>
                <option value="eSSL">eSSL</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">IP Address</label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="192.168.1.201"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Port</label>
              <input
                type="text"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                placeholder="4370"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Main Gate, Reception, etc."
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              required
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg ${testResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
              {testResult.message}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleTest} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {machine ? 'Update' : 'Add'} Machine
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
