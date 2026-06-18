'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGetShiftsQuery, useCreateShiftMutation, useUpdateShiftMutation, useDeleteShiftMutation } from '@/store/services/shiftsApi';
import ShiftsHeader from './components/ShiftsHeader';
import ShiftsFilters, { DEFAULT_SHIFTS_FILTERS, ShiftsFilterState } from './components/ShiftsFilters';
import ShiftsSummaryWidgets from './components/ShiftsSummaryWidgets';
import ShiftsTable from './components/ShiftsTable';
import ShiftFormModal from './components/ShiftFormModal';
import AssignShiftModal from './components/AssignShiftModal';
import AssignedEmployeesModal from './components/AssignedEmployeesModal';
import ShiftCalendarView from './components/ShiftCalendarView';
import ShiftAlerts from './components/ShiftAlerts';
import ShiftAuditLogs from './components/ShiftAuditLogs';
import {
  Shift,
  ShiftAssignment,
  AuditLog,
  calcWorkingHours,
} from './components/shiftsData';

const parseHM = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};

export default function ShiftsManagementPage() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const [draft, setDraft] = useState<ShiftsFilterState>(DEFAULT_SHIFTS_FILTERS);
  const [applied, setApplied] = useState<ShiftsFilterState>(DEFAULT_SHIFTS_FILTERS);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Shift | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignedOpen, setAssignedOpen] = useState(false);
  const [viewingShift, setViewingShift] = useState<Shift | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Redux API calls
  const { data: shiftsData, isLoading, refetch } = useGetShiftsQuery({});
  const [createShift] = useCreateShiftMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();

  const shifts = shiftsData?.data || [];

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const filtered = useMemo(() => {
    return shifts.filter((s: Shift) => {
      if (applied.type !== 'All Types' && s.type !== applied.type) return false;
      if (applied.status !== 'All' && s.status !== applied.status) return false;
      if (applied.fromTime && parseHM(s.startTime) < parseHM(applied.fromTime)) return false;
      if (applied.toTime && parseHM(s.endTime) > parseHM(applied.toTime)) return false;
      if (applied.department !== 'All Departments') {
        const hasDept = assignments.some((a) => a.shiftId === (s._id || s.id) && a.department === applied.department);
        if (!hasDept) return false;
      }
      return true;
    });
  }, [shifts, applied, assignments]);

  const pushLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    setLogs((ls) => [
      { ...log, id: `lg-${Date.now()}`, timestamp: new Date().toISOString() },
      ...ls,
    ]);
  };

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (s: Shift) => { setEditing(s); setFormOpen(true); };

  const handleSave = async (data: Omit<Shift, 'id' | 'assignedCount' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>) => {
    try {
      if (editing) {
        await updateShift({ id: editing._id || editing.id || '', ...data }).unwrap();
        refetch();
        pushLog({ shiftId: editing._id || editing.id || '', shiftName: data.name, action: 'edited', actor: 'Admin', detail: 'Shift details updated' });
        setToast('Shift updated');
      } else {
        await createShift(data).unwrap();
        refetch();
        pushLog({ shiftId: 'new', shiftName: data.name, action: 'created', actor: 'Admin', detail: 'New shift created' });
        setToast('Shift created');
      }
    } catch (error) {
      console.error('Failed to save shift:', error);
    }
  };

  const handleDuplicate = async (s: Shift) => {
    try {
      await createShift({ ...s, name: `${s.name} (Copy)`, code: `${s.code}-C` }).unwrap();
      refetch();
      pushLog({ shiftId: s._id || s.id || '', shiftName: s.name, action: 'duplicated', actor: 'Admin', detail: `Duplicated from ${s.name}` });
      setToast('Shift duplicated');
    } catch (error) {
      console.error('Failed to duplicate shift:', error);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm(`Delete ${ids.length} shift(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(ids.map((id) => deleteShift(id).unwrap()));
      refetch();
      ids.forEach((id) => {
        const target = shifts.find((s: Shift) => (s._id || s.id) === id);
        if (target) pushLog({ shiftId: id, shiftName: target.name, action: 'deleted', actor: 'Admin' });
      });
      setToast(`${ids.length} shift(s) deleted`);
    } catch (error) {
      console.error('Failed to delete shifts:', error);
    }
  };

  const handleToggleStatus = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) => {
          const target = shifts.find((s: Shift) => (s._id || s.id) === id);
          const next = target?.status === 'Active' ? 'Inactive' : 'Active';
          return updateShift({ id, status: next }).unwrap();
        })
      );
      refetch();
      ids.forEach((id) => {
        const target = shifts.find((s: Shift) => (s._id || s.id) === id);
        const next = target?.status === 'Active' ? 'Inactive' : 'Active';
        if (target) pushLog({ shiftId: id, shiftName: target.name, action: 'status-changed', actor: 'Admin', detail: `${target.status} → ${next}` });
      });
      setToast('Status updated');
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleViewAssigned = (s: Shift) => { setViewingShift(s); setAssignedOpen(true); };

  const handleAssign = ({ shiftId, empIds, effectiveFrom, effectiveTo }: { shiftId: string; empIds: string[]; effectiveFrom: string; effectiveTo: string }) => {
    const target = shifts.find((s: Shift) => (s._id || s.id) === shiftId);
    if (!target) return;
    // Assignments will be managed by the API - this is a placeholder
    setToast(`Assigning ${empIds.length} employee(s) to shift`);
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    const a = assignments.find((x) => (x._id || x.id) === assignmentId);
    if (!a) return;
    if (!window.confirm(`Remove ${a.empName} from this shift?`)) return;
    setAssignments((arr: ShiftAssignment[]) => arr.filter((x) => (x._id || x.id) !== assignmentId));
    setToast('Assignment removed');
  };

  const handleChangeShiftAssignment = () => {
    setAssignedOpen(false);
    setAssignOpen(true);
  };

  // Exports
  const exportCSV = () => {
    const headers = ['Name', 'Code', 'Start', 'End', 'Break (m)', 'Hours', 'Type', 'Assigned', 'Status'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...filtered.map((s: Shift) => [s.name, s.code, s.startTime, s.endTime, String(s.breakMinutes), s.workingHours || '', s.type, String(s.assignedCount || 0), s.status].map(escape).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const html = `<!doctype html><html><head><title>Shifts</title>
<style>body{font-family:sans-serif;padding:20px}h1{font-size:18px;margin:0 0 12px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#f5f5f5}</style>
</head><body><h1>Shift Management Report — ${new Date().toLocaleDateString()}</h1>
<table><thead><tr><th>Name</th><th>Code</th><th>Start</th><th>End</th><th>Break</th><th>Hours</th><th>Type</th><th>Assigned</th><th>Status</th></tr></thead>
<tbody>${filtered.map((s: Shift) => `<tr><td>${s.name}</td><td>${s.code}</td><td>${s.startTime}</td><td>${s.endTime}</td><td>${s.breakMinutes}m</td><td>${s.workingHours || ''}</td><td>${s.type}</td><td>${s.assignedCount || 0}</td><td>${s.status}</td></tr>`).join('')}</tbody></table>
<script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="space-y-6">
      <ShiftsHeader
        onAdd={handleAdd}
        onAssign={() => setAssignOpen(true)}
        onExportCSV={exportCSV}
        onExportXLS={exportCSV}
        onExportPDF={exportPDF}
      />

      <ShiftsSummaryWidgets shifts={shifts} />

      <ShiftsFilters
        draft={draft}
        onDraftChange={setDraft}
        onApply={() => setApplied(draft)}
        onReset={() => { setDraft(DEFAULT_SHIFTS_FILTERS); setApplied(DEFAULT_SHIFTS_FILTERS); }}
      />

      <ShiftsTable
        shifts={filtered}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onViewAssigned={handleViewAssigned}
      />

      <ShiftCalendarView shifts={shifts} assignments={assignments} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ShiftAlerts shifts={shifts} />
        <ShiftAuditLogs logs={logs} />
      </div>

      <ShiftFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} editing={editing} onSave={handleSave} />
      <AssignShiftModal isOpen={assignOpen} onClose={() => setAssignOpen(false)} shifts={shifts} onAssign={handleAssign} />
      <AssignedEmployeesModal
        isOpen={assignedOpen}
        onClose={() => setAssignedOpen(false)}
        shift={viewingShift}
        assignments={assignments}
        onRemove={handleRemoveAssignment}
        onChangeShift={handleChangeShiftAssignment}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
