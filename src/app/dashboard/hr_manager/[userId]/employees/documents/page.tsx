'use client';

import { useState, useEffect } from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useGetAllUsersQuery } from '@/store/services/userApi';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import DocumentSummaryWidgets from './components/DocumentSummaryWidgets';
import DocumentFilters from './components/DocumentFilters';
import DocumentsTable from './components/DocumentsTable';
import UploadDocumentModal from './components/UploadDocumentModal';
import MissingDocumentsSection from './components/MissingDocumentsSection';
import ExpiryAlertsPanel from './components/ExpiryAlertsPanel';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [department, setDepartment] = useState('');
  const [expiryStatus, setExpiryStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [expiringDocuments, setExpiringDocuments] = useState<any[]>([]);
  const [expiredDocuments, setExpiredDocuments] = useState<any[]>([]);
  const [missingDocuments, setMissingDocuments] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);

  const { data: usersRes } = useGetAllUsersQuery({});
  const rawUsers: any[] = usersRes?.data?.users ?? usersRes?.data?.items ?? usersRes?.data ?? [];
  const employees = rawUsers.map((u: any) => ({
    id: u._id ?? u.id,
    name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
    employeeId: u.employeeId ?? u._id ?? u.id,
  }));

  useEffect(() => {
    const fetchDocs = async () => {
      setDocsLoading(true);
      try {
        const [docsRes, expiryRes, missingRes] = await Promise.allSettled([
          api.get<any>('/documents'),
          api.get<any>('/documents/expiring'),
          api.get<any>('/documents/missing'),
        ]);
        if (docsRes.status === 'fulfilled') {
          const d = docsRes.value;
          setDocuments(d.data?.documents ?? d.data?.items ?? d.data ?? []);
        }
        if (expiryRes.status === 'fulfilled') {
          const e = expiryRes.value;
          const all: any[] = e.data?.documents ?? e.data?.items ?? e.data ?? [];
          setExpiringDocuments(all.filter((x: any) => (x.daysUntilExpiry ?? 0) > 0));
          setExpiredDocuments(all.filter((x: any) => (x.daysUntilExpiry ?? 0) <= 0));
        }
        if (missingRes.status === 'fulfilled') {
          const m = missingRes.value;
          setMissingDocuments(m.data?.employees ?? m.data?.items ?? m.data ?? []);
        }
      } finally {
        setDocsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const filteredDocuments = documents.filter((doc: any) => {
    const name = (doc.employeeName ?? doc.employee?.name ?? '').toLowerCase();
    const title = (doc.documentTitle ?? doc.title ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || name.includes(term) || title.includes(term);
    const matchType = !documentType || doc.documentType === documentType;
    const matchDept = !department || (doc.department ?? doc.employee?.department) === department;
    const matchExpiry = !expiryStatus || doc.status === expiryStatus;
    return matchSearch && matchType && matchDept && matchExpiry;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setDocumentType('');
    setDepartment('');
    setExpiryStatus('');
    setDateRange('');
  };

  const handleView = (_id: string) => toast.info('Document viewer coming soon');
  const handleDownload = (_id: string) => toast.info('Download coming soon');
  const handleReplace = (_id: string) => toast.info('Replace functionality coming soon');

  const handleVerify = async (id: string) => {
    try { await api.patch(`/documents/${id}/verify`, {}); toast.success('Document verified'); setDocuments(p => p.map(d => (d._id ?? d.id) === id ? { ...d, status: 'verified' } : d)); } catch {}
  };

  const handleUnverify = async (id: string) => {
    try { await api.patch(`/documents/${id}/unverify`, {}); toast.success('Document unverified'); setDocuments(p => p.map(d => (d._id ?? d.id) === id ? { ...d, status: 'not-verified' } : d)); } catch {}
  };

  const handleDelete = async (id: string) => {
    try { await api.del(`/documents/${id}`); toast.success('Document deleted'); setDocuments(p => p.filter(d => (d._id ?? d.id) !== id)); } catch {}
  };

  const handleUploadSubmit = async (data: any) => {
    try { await api.post('/documents', data); toast.success('Document uploaded successfully'); setIsUploadModalOpen(false); } catch {}
  };

  const handleSendReminder = async (empId: string) => {
    try { await api.post('/documents/reminder', { employeeId: empId }); toast.success('Reminder sent'); } catch {}
  };

  const handleAddDocument = (_empId: string) => setIsUploadModalOpen(true);
  const handleExportList = () => toast.info('Export coming soon');
  const handleBulkUpload = () => toast.info('Bulk upload coming soon');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Employee Documents</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage and track all employee documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkUpload}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>
          <button
            onClick={handleExportList}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export List
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Document Summary Widgets */}
      <DocumentSummaryWidgets />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <DocumentFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              documentType={documentType}
              onDocumentTypeChange={setDocumentType}
              department={department}
              onDepartmentChange={setDepartment}
              expiryStatus={expiryStatus}
              onExpiryStatusChange={setExpiryStatus}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Documents Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            {docsLoading ? <LoadingSpinner /> : null}
            <DocumentsTable
              documents={filteredDocuments}
              onView={handleView}
              onDownload={handleDownload}
              onReplace={handleReplace}
              onVerify={handleVerify}
              onUnverify={handleUnverify}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Expiry Alerts */}
          <ExpiryAlertsPanel
            expiringDocuments={expiringDocuments}
            expiredDocuments={expiredDocuments}
          />

          {/* Missing Documents */}
          <MissingDocumentsSection
            missingDocuments={missingDocuments}
            onSendReminder={handleSendReminder}
            onAddDocument={handleAddDocument}
          />
        </div>
      </div>

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        employees={employees}
      />
    </div>
  );
}
