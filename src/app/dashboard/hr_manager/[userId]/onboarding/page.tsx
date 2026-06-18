'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Copy, ExternalLink, Mail, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useGetJoiningLinksQuery, useCreateJoiningLinkMutation, useDeactivateLinkMutation, useResendEmailMutation } from '@/store/services/onboardingApi';

interface JoiningLink {
  _id: string;
  token: string;
  employeeName: string;
  email: string;
  departmentId: {
    _id: string;
    name: string;
  };
  joiningDate: string;
  status: 'pending' | 'submitted' | 'expired';
  expiresAt: string;
  submittedAt?: string;
  createdAt: string;
}

export default function OnboardingPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalData, setModalData] = useState({
    employeeName: '',
    email: '',
    departmentId: '',
    joiningDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [showLinkActions, setShowLinkActions] = useState(false);

  // Redux API calls
  const { data: linksData, isLoading, refetch } = useGetJoiningLinksQuery({});
  const [createJoiningLink] = useCreateJoiningLinkMutation();
  const [deactivateLink] = useDeactivateLinkMutation();
  const [resendEmail] = useResendEmailMutation();

  const links = linksData?.data?.joiningForms || [];

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/joining/${token}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handleOpenInNewTab = (token: string) => {
    window.open(`/joining/${token}`, '_blank');
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this link?')) return;

    try {
      await deactivateLink(id);
      refetch();
    } catch (error) {
      console.error('Failed to deactivate link:', error);
    }
  };

  const handleResendEmail = async (id: string) => {
    try {
      await resendEmail(id);
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to resend email:', error);
    }
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = await createJoiningLink(modalData).unwrap();

      if (data.success) {
        setGeneratedLink(data.data.joiningUrl);
        setShowLinkActions(true);
        refetch();
      } else {
        alert(data.message || 'Failed to generate link');
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
      alert('Failed to generate link');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGeneratedLink('');
    setShowLinkActions(false);
    setModalData({
      employeeName: '',
      email: '',
      departmentId: '',
      joiningDate: '',
    });
  };

  const filteredLinks = links.filter((link: JoiningLink) => {
    const matchesSearch = link.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Employee Onboarding</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Manage joining links and submissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Joining Link
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Employee Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Joining Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Submitted Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    No joining links found
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link: JoiningLink) => (
                  <tr key={link._id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{link.employeeName}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{link.email}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{link.departmentId?.name || '-'}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {new Date(link.joiningDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        link.status === 'submitted' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {link.submittedAt ? new Date(link.submittedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(link.token)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                          title="Copy Link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenInNewTab(link.token)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                          title="Open in New Tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        {link.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleResendEmail(link._id)}
                              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeactivate(link._id)}
                              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-red-600"
                              title="Deactivate Link"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Joining Link Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold">
                {showLinkActions ? 'Joining Link Generated' : 'Generate New Joining Link'}
              </h2>
            </div>
            
            {!showLinkActions ? (
              <form onSubmit={handleGenerateLink} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Employee Name</label>
                  <input
                    type="text"
                    required
                    value={modalData.employeeName}
                    onChange={(e) => setModalData({...modalData, employeeName: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={modalData.email}
                    onChange={(e) => setModalData({...modalData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select
                    required
                    value={modalData.departmentId}
                    onChange={(e) => setModalData({...modalData, departmentId: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={modalData.joiningDate}
                    onChange={(e) => setModalData({...modalData, joiningDate: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  />
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-400 mb-2">Joining link generated successfully!</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="flex-1 px-3 py-2 rounded bg-white dark:bg-zinc-800 border border-green-200 dark:border-green-800 text-sm font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      window.open(generatedLink, '_blank');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => {
                      alert('Email sending not yet implemented');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <Mail className="h-4 w-4" />
                    Send Email
                  </button>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                {showLinkActions ? 'Close' : 'Cancel'}
              </button>
              {!showLinkActions && (
                <button 
                  type="submit"
                  onClick={handleGenerateLink}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] disabled:opacity-60"
                >
                  {submitting ? 'Generating...' : 'Generate Link'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
