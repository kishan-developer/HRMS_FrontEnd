'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building2, Calendar, Edit, Save, Camera, Upload, FileText, GraduationCap, Briefcase, Link as LinkIcon, X, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function HRManagerProfile() {
  const currentUser = getUser();
  const params = useParams();
  const urlUserId = params?.userId;
  const userId = currentUser?.id; // Use authenticated user's ID for profile operations
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Redirect to login if no user
  useEffect(() => {
    if (!currentUser || !userId) {
      window.location.href = '/auth/login';
    }
  }, [currentUser, userId]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const data = await api.get<{ success: boolean; data: any }>(`/users/${userId}`);
      if (data.success) {
        setProfile(data.data);
        setFormData(data.data || {});
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await api.put<{ success: boolean; data: any }>(`/users/${userId}/profile`, formData);
      
      if (data.success) {
        setProfile(data.data);
        setEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1/users/${userId}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        fetchProfile();
        toast.success('Document uploaded');
      } else {
        toast.error('Failed to upload document');
      }
    } catch {
      toast.error('Failed to upload document');
    }
  };

  const handleDeleteDocument = async (documentName: string) => {
    try {
      await api.del(`/users/${userId}/documents`, { body: JSON.stringify({ documentName }) });
      fetchProfile();
      toast.success('Document deleted');
    } catch {
      toast.error('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94cb3d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Profile</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your personal information</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditing(false);
                setFormData(profile);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-3xl font-bold text-zinc-600 dark:text-zinc-400">
              {profile?.firstName?.[0] || profile?.email?.[0] || 'U'}
            </div>
            {editing && (
              <label className="absolute bottom-0 right-0 p-2 bg-[#94cb3d] rounded-full cursor-pointer hover:bg-[#7ab32e] transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {profile?.firstName && profile?.lastName 
                ? `${profile.firstName} ${profile.lastName}`
                : profile?.name || 'User'}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{profile?.email}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Building2 className="h-4 w-4" />
                {profile?.department || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Briefcase className="h-4 w-4" />
                {profile?.designation || profile?.role || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#94cb3d] text-[#94cb3d]'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.firstName || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.lastName || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.dateOfBirth || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Gender</label>
                  {editing ? (
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{profile?.gender || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.email || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.phone || 'N/A'}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Current Address</label>
                  {editing ? (
                    <textarea
                      value={formData.currentAddress || ''}
                      onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.currentAddress || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Work Tab */}
          {activeTab === 'work' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Employee ID</label>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.employeeId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Department</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.department || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Designation</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.designation || ''}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.designation || profile?.role || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date of Joining</label>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {profile?.dateOfJoining || profile?.createdAt 
                      ? new Date(profile.dateOfJoining || profile.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Highest Qualification</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.highestQualification || ''}
                      onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                      placeholder="e.g., Bachelor's Degree, Master's Degree"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.highestQualification || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">College/University Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.collegeName || ''}
                      onChange={(e) => handleInputChange('collegeName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                      placeholder="e.g., XYZ University"
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.collegeName || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Passing Year</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.passingYear || ''}
                      onChange={(e) => handleInputChange('passingYear', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                      placeholder="e.g., 2020"
                      min="1950"
                      max={new Date().getFullYear() + 5}
                    />
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile?.passingYear || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {editing && (
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Upload documents</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Choose File
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}
              
              <div className="space-y-2">
                {profile?.documents && profile.documents.length > 0 ? (
                  profile.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{doc.name || doc}</span>
                      </div>
                      {editing && (
                        <button
                          onClick={() => handleDeleteDocument(doc.name || doc)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">No documents uploaded</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
