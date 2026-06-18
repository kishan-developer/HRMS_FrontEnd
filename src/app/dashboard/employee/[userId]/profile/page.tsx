'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building2, Calendar, Edit, Save, Camera, Upload, FileText, GraduationCap, Briefcase, Link as LinkIcon, X, Download } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getToken, getUser } from '@/lib/auth';

export default function EmployeeProfile() {
  const currentUser = getUser();
  const userId = currentUser?.id;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  console.log('Current user from auth:', currentUser);
  console.log('Using userId for fetch:', userId);

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
      const fetchUrl = `${BACKEND_URL}/api/v1/users/${userId}?_t=${Date.now()}`;
      console.log('Fetching profile from:', fetchUrl);
      
      const response = await fetch(fetchUrl, {
        cache: 'no-store',
      });
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        console.log('Profile data fetched:', data.data);
        setProfile(data.data);
        setFormData(data.data || {});
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      console.log('Token from getToken():', token ? 'Token exists' : 'No token');
      console.log('Token length:', token?.length);
      console.log('First 50 chars of token:', token?.substring(0, 50));
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set');
      } else {
        console.error('No token available - user not logged in');
      }

      console.log('Sending PUT request to:', `${BACKEND_URL}/api/v1/users/${userId}/profile`);
      console.log('Request body:', formData);

      const response = await fetch(`${BACKEND_URL}/api/v1/users/${userId}/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setProfile(data.data);
        setEditing(false);
      } else {
        alert('Failed to update profile: ' + data.error?.message || data.message);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
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

    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${userId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Refresh profile to get updated documents
        fetchProfile();
      } else {
        alert('Failed to upload document: ' + data.error?.message || data.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    }
  };

  const handleDeleteDocument = async (documentName: string) => {
    const token = getToken();

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${userId}/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentName }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh profile to get updated documents
        fetchProfile();
      } else {
        alert('Failed to delete document: ' + data.error?.message || data.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">My Profile</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Manage your personal and professional information</p>
        </div>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : editing ? <><Save className="h-4 w-4" /> Save</> : <><Edit className="h-4 w-4" /> Edit</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex flex-col items-center text-center overflow-hidden text-wrap">
              <div className="relative">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#94cb3d] bg-opacity-20 flex items-center justify-center">
                    <User className="h-16 w-16 text-[#94cb3d]" />
                  </div>
                )}
                {editing && (
                  <button 
                    onClick={() => {
                      const url = prompt('Enter photo URL:', formData.photoUrl || '');
                      if (url !== null) {
                        handleInputChange('photoUrl', url);
                      }
                    }}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#94cb3d] rounded-full flex items-center justify-center text-white hover:bg-[#7ab52f] transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-4 text-center ">
                
                {formData.firstName}
                {formData.lastName}
             
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 capitalize">{formData.role}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Building2 className="h-4 w-4" />
                {formData.department || 'Not assigned'}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4" />
                {formData.branch || 'Not assigned'}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Employee ID</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{formData.employeeId || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Joining Date</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            {/* Tabs */}
            <div className="border-b border-zinc-200 dark:border-zinc-700">
              <nav className="flex space-x-0 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#94cb3d] text-[#94cb3d]'
                        : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">First Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.firstName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Middle Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.middleName || ''}
                          onChange={(e) => handleInputChange('middleName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.middleName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Last Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.lastName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.displayName || ''}
                          onChange={(e) => handleInputChange('displayName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.displayName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Date of Birth</label>
                      {editing ? (
                        <input
                          type="date"
                          value={formData.dateOfBirth || ''}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.dateOfBirth || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Phone</label>
                      {editing ? (
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.phone || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Gender</label>
                      {editing ? (
                        <select
                          value={formData.gender || ''}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50 capitalize">{formData.gender || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Marital Status</label>
                      {editing ? (
                        <select
                          value={formData.maritalStatus || ''}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        >
                          <option value="">Select Status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50 capitalize">{formData.maritalStatus || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Blood Group</label>
                      {editing ? (
                        <select
                          value={formData.bloodGroup || ''}
                          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.bloodGroup || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nationality</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.nationality || ''}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.nationality || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Religion</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.religion || ''}
                          onChange={(e) => handleInputChange('religion', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.religion || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Father's Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.fatherName || ''}
                          onChange={(e) => handleInputChange('fatherName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.fatherName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Mother's Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.motherName || ''}
                          onChange={(e) => handleInputChange('motherName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.motherName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Spouse's Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.spouseName || ''}
                          onChange={(e) => handleInputChange('spouseName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.spouseName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">PAN Number</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.panNumber || ''}
                          onChange={(e) => handleInputChange('panNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.panNumber || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Aadhar Number</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.aadharNumber || ''}
                          onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.aadharNumber || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Passport Number</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.passportNumber || ''}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.passportNumber || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Emergency Contact Section */}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                    <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Contact Name</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.emergencyContactName || ''}
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.emergencyContactName || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Contact Phone</label>
                        {editing ? (
                          <input
                            type="tel"
                            value={formData.emergencyContactPhone || ''}
                            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.emergencyContactPhone || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Relation</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.emergencyContactRelation || ''}
                            onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.emergencyContactRelation || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Contact Information</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-zinc-500" />
                        {editing ? (
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.email || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Mobile Number</label>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-zinc-500" />
                        {editing ? (
                          <input
                            type="tel"
                            value={formData.mobile || ''}
                            onChange={(e) => handleInputChange('mobile', e.target.value)}
                            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.mobile || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Alternative Mobile</label>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-zinc-500" />
                        {editing ? (
                          <input
                            type="tel"
                            value={formData.alternativeMobile || ''}
                            onChange={(e) => handleInputChange('alternativeMobile', e.target.value)}
                            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.alternativeMobile || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Address</label>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-zinc-500 mt-3" />
                        {editing ? (
                          <textarea
                            rows={3}
                            value={formData.currentAddress || ''}
                            onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.currentAddress || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Permanent Address</label>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-zinc-500 mt-3" />
                        {editing ? (
                          <textarea
                            rows={3}
                            value={formData.permanentAddress || ''}
                            onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.permanentAddress || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Current Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">City</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.city || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">State</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.state || ''}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.state || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Country</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.country || ''}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.country || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Zip Code</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.zipCode || ''}
                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.zipCode || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Permanent Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Permanent City</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.permanentCity || ''}
                            onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.permanentCity || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Permanent State</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.permanentState || ''}
                            onChange={(e) => handleInputChange('permanentState', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.permanentState || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Permanent Country</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.permanentCountry || ''}
                            onChange={(e) => handleInputChange('permanentCountry', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.permanentCountry || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Permanent Zip Code</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.permanentZipCode || ''}
                            onChange={(e) => handleInputChange('permanentZipCode', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.permanentZipCode || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'work' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Work Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employee ID</label>
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-4 w-4 text-zinc-500" />
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.employeeId || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Designation</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.designation || ''}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.designation || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Department</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.department || ''}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.department || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Branch</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.branch || ''}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.branch || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employment Type</label>
                      {editing ? (
                        <select
                          value={formData.employmentType || ''}
                          onChange={(e) => handleInputChange('employmentType', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        >
                          <option value="">Select Type</option>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="intern">Intern</option>
                        </select>
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50 capitalize">{formData.employmentType || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Work Type</label>
                      {editing ? (
                        <select
                          value={formData.workType || ''}
                          onChange={(e) => handleInputChange('workType', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        >
                          <option value="">Select Work Type</option>
                          <option value="Office">Office</option>
                          <option value="Remote">Remote</option>
                          <option value="On Field">On Field</option>
                        </select>
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.workType || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employee Status</label>
                      {editing ? (
                        <select
                          value={formData.employeeStatus || ''}
                          onChange={(e) => handleInputChange('employeeStatus', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        >
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Probation">Probation</option>
                        </select>
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.employeeStatus || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Company</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.company || ''}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.company || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Joining Date</label>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        <p className="text-zinc-900 dark:text-zinc-50">
                          {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Work Location</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.workLocation || ''}
                          onChange={(e) => handleInputChange('workLocation', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.workLocation || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Probation End Date</label>
                      {editing ? (
                        <input
                          type="date"
                          value={formData.probationEndDate || ''}
                          onChange={(e) => handleInputChange('probationEndDate', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.probationEndDate || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Contract End Date</label>
                      {editing ? (
                        <input
                          type="date"
                          value={formData.contractEndDate || ''}
                          onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.contractEndDate || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Banking Information Section */}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                    <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Banking Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Bank Name</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.bankName || ''}
                            onChange={(e) => handleInputChange('bankName', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.bankName || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Number</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.bankAccountNumber || ''}
                            onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.bankAccountNumber || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">IFSC Code</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.bankIfscCode || ''}
                            onChange={(e) => handleInputChange('bankIfscCode', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.bankIfscCode || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Salary</label>
                        {editing ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={formData.salary || ''}
                              onChange={(e) => handleInputChange('salary', e.target.value)}
                              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                            />
                            <input
                              type="text"
                              value={formData.salaryCurrency || 'INR'}
                              onChange={(e) => handleInputChange('salaryCurrency', e.target.value)}
                              className="w-20 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                            />
                          </div>
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">
                            {formData.salary ? `${formData.salary} ${formData.salaryCurrency || 'INR'}` : 'N/A'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">PF Number</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.pfNumber || ''}
                            onChange={(e) => handleInputChange('pfNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.pfNumber || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">ESI Number</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.esiNumber || ''}
                            onChange={(e) => handleInputChange('esiNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.esiNumber || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">UAN Number</label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.uanNumber || ''}
                            onChange={(e) => handleInputChange('uanNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <p className="text-zinc-900 dark:text-zinc-50">{formData.uanNumber || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Highest Qualification</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.highestQualification || ''}
                          onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.highestQualification || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">College Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.collegeName || ''}
                          onChange={(e) => handleInputChange('collegeName', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.collegeName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Passing Year</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.passingYear || ''}
                          onChange={(e) => handleInputChange('passingYear', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                        />
                      ) : (
                        <p className="text-zinc-900 dark:text-zinc-50">{formData.passingYear || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Documents</h3>
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Drag and drop files here</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">or click to browse</p>
                    <input
                      type="file"
                      id="document-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="document-upload"
                      className="mt-4 inline-block px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors cursor-pointer"
                    >
                      Upload Document
                    </label>
                  </div>
                  {formData.documents && formData.documents.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Uploaded Documents</h4>
                      {formData.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-zinc-500" />
                            <div>
                              <span className="text-sm text-zinc-900 dark:text-zinc-50 block">{doc.name}</span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-500">
                                {(doc.size / 1024).toFixed(2)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={doc.url}
                              download={doc.name}
                              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.name)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
