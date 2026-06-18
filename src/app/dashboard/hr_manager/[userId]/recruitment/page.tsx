'use client';

import { useState } from 'react';
import { Plus, Upload, Settings } from 'lucide-react';
import RecruitmentOverviewWidgets from './components/RecruitmentOverviewWidgets';
import RecruitmentFilters from './components/RecruitmentFilters';
import CandidatesTable from './components/CandidatesTable';
import JobOpeningsSection from './components/JobOpeningsSection';
import CandidateProfileModal from './components/CandidateProfileModal';
import { useGetCandidatesQuery, useGetJobsQuery, useCreateCandidateMutation, useCreateJobMutation, useUpdateCandidateMutation, useUpdateJobMutation, useDeleteCandidateMutation, useDeleteJobMutation } from '@/store/services/recruitmentApi';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [experience, setExperience] = useState('');
  const [stage, setStage] = useState('');
  const [source, setSource] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Redux API calls
  const { data: candidatesData, isLoading: candidatesLoading, refetch: refetchCandidates } = useGetCandidatesQuery({});
  const { data: jobsData, refetch: refetchJobs } = useGetJobsQuery({});
  const [createCandidate] = useCreateCandidateMutation();
  const [createJob] = useCreateJobMutation();
  const [updateCandidate] = useUpdateCandidateMutation();
  const [updateJob] = useUpdateJobMutation();
  const [deleteCandidate] = useDeleteCandidateMutation();
  const [deleteJob] = useDeleteJobMutation();

  const candidates = candidatesData?.data || [];
  const jobOpenings = jobsData?.data || [];

  const handleClearFilters = () => {
    setSearchTerm('');
    setJobPosition('');
    setDepartment('');
    setExperience('');
    setStage('');
    setSource('');
    setDateRange('');
  };

  const handleViewProfile = (id: string) => {
    const candidate = candidates.find((c: any) => c.id === id);
    if (candidate) {
      setSelectedCandidate({
        ...candidate,
        email: 'candidate@email.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        education: 'B.Tech Computer Science',
        notes: ['Initial screening completed', 'Technical interview scheduled'],
        interviews: [
          { type: 'HR Round', date: '2024-05-20', interviewer: 'Jane Smith', status: 'completed' },
        ],
      });
      setIsProfileModalOpen(true);
    }
  };

  const handleMoveStage = (id: string) => {
    alert(`Candidate stage update would be handled via API`);
    refetchCandidates();
  };

  const handleAssignInterview = (id: string) => {
    const candidate = candidates.find((c: any) => c.id === id);
    if (candidate) {
      const date = prompt(`Enter interview date for ${candidate.name} (YYYY-MM-DD):`);
      const time = prompt(`Enter interview time for ${candidate.name} (HH:MM):`);
      if (date && time) {
        alert(`Interview scheduled for ${candidate.name} on ${date} at ${time}`);
      }
    }
  };

  const handleAddNotes = (id: string) => {
    const candidate = candidates.find((c: any) => c.id === id);
    if (candidate) {
      const note = prompt(`Add note for ${candidate.name}:`);
      if (note) {
        alert(`Note added for ${candidate.name}: ${note}`);
      }
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this candidate?')) {
      alert(`Candidate rejection would be handled via API`);
      refetchCandidates();
    }
  };

  const handleMoveStageFromModal = (id: string, stage: string) => {
    alert(`Candidate moved to ${stage} stage`);
    refetchCandidates();
  };

  const handleScheduleInterview = (id: string) => {
    const candidate = candidates.find((c: any) => c.id === id);
    if (candidate) {
      const date = prompt(`Enter interview date for ${candidate.name} (YYYY-MM-DD):`);
      const time = prompt(`Enter interview time for ${candidate.name} (HH:MM):`);
      if (date && time) {
        alert(`Interview scheduled for ${candidate.name} on ${date} at ${time}`);
      }
    }
  };

  const handleAddNote = (id: string, note: string) => {
    if (note) {
      alert(`Note added for candidate: ${note}`);
    }
  };

  const handleRejectFromModal = (id: string) => {
    if (confirm('Are you sure you want to reject this candidate?')) {
      alert(`Candidate rejection would be handled via API`);
      setIsProfileModalOpen(false);
      refetchCandidates();
    }
  };

  const handleCreateJob = () => {
    const title = prompt('Enter job title:');
    const department = prompt('Enter department:');
    const openings = prompt('Enter number of openings:');
    if (title && department && openings) {
      alert('Job creation would be handled via API');
      refetchJobs();
    }
  };

  const handleAddCandidate = () => {
    const name = prompt('Enter candidate name:');
    const appliedFor = prompt('Enter position applied for:');
    const experience = prompt('Enter experience (e.g., 3-5 Years):');
    if (name && appliedFor && experience) {
      alert('Candidate addition would be handled via API');
      refetchCandidates();
    }
  };

  const handleImportCandidates = () => {
    alert('Candidate import would be handled via API');
  };

  const handleRecruitmentSettings = () => {
    alert('Recruitment settings panel would open here');
  };

  const handleViewApplicants = (jobId: string) => {
    const job = jobOpenings.find((j: any) => j.id === jobId);
    if (job) {
      const jobCandidates = candidates.filter((c: any) => c.appliedFor === job.title);
      alert(`Viewing ${jobCandidates.length} applicants for ${job.title}`);
    }
  };

  const handleEditJob = (jobId: string) => {
    const job = jobOpenings.find((j: any) => j.id === jobId);
    if (job) {
      const newTitle = prompt('Enter new job title:', job.title);
      const newOpenings = prompt('Enter new number of openings:', job.openingsCount.toString());
      if (newTitle && newOpenings) {
        alert('Job update would be handled via API');
        refetchJobs();
      }
    }
  };

  const handleClosePosition = (jobId: string) => {
    if (confirm('Are you sure you want to close this position?')) {
      alert('Job closing would be handled via API');
      refetchJobs();
    }
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job opening?')) {
      alert('Job deletion would be handled via API');
      refetchJobs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Recruitment Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage job openings and candidate applications</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImportCandidates}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import Candidates
          </button>
          <button
            onClick={handleRecruitmentSettings}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={handleAddCandidate}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Candidate
          </button>
          <button
            onClick={handleCreateJob}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Job Opening
          </button>
        </div>
      </div>

      {/* Recruitment Overview Widgets */}
      <RecruitmentOverviewWidgets />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <RecruitmentFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              jobPosition={jobPosition}
              onJobPositionChange={setJobPosition}
              department={department}
              onDepartmentChange={setDepartment}
              experience={experience}
              onExperienceChange={setExperience}
              stage={stage}
              onStageChange={setStage}
              source={source}
              onSourceChange={setSource}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Candidates Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <CandidatesTable
              candidates={candidates}
              onViewProfile={handleViewProfile}
              onMoveStage={handleMoveStage}
              onAssignInterview={handleAssignInterview}
              onAddNotes={handleAddNotes}
              onReject={handleReject}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <JobOpeningsSection
            jobOpenings={jobOpenings}
            onViewApplicants={handleViewApplicants}
            onEditJob={handleEditJob}
            onClosePosition={handleClosePosition}
            onDelete={handleDeleteJob}
          />
        </div>
      </div>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        isOpen={isProfileModalOpen}
        onClose={() => { setIsProfileModalOpen(false); setSelectedCandidate(null); }}
        onMoveStage={handleMoveStageFromModal}
        onScheduleInterview={handleScheduleInterview}
        onAddNote={handleAddNote}
        onReject={handleRejectFromModal}
      />
    </div>
  );
}