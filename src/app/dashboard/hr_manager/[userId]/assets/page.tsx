'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useGetAssetsQuery, useCreateAssetMutation, useUpdateAssetMutation, useDeleteAssetMutation } from '@/store/services/assetsApi';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Redux API calls
  const { data: assetsData, isLoading, refetch } = useGetAssetsQuery({});
  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  const assets = assetsData?.data || [];

  const handleCreateAsset = () => {
    alert('Asset creation would be handled via API');
    refetch();
  };

  const handleEditAsset = (id: string) => {
    alert('Asset edit would be handled via API');
    refetch();
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      alert('Asset deletion would be handled via API');
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Assets</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Manage company assets and inventory</p>
        </div>
        <button
          onClick={handleCreateAsset}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Assets Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
        {isLoading ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            Loading assets...
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            No assets found. Click "Add Asset" to create one.
          </div>
        ) : (
          <div className="text-zinc-600 dark:text-zinc-400">
            <p>Assets loaded successfully via Redux API</p>
            <p className="mt-2">Total assets: {assets.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
