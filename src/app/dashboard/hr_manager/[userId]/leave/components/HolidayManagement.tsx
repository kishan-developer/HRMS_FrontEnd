'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface HolidayManagementProps {
  holidays?: any[];
}

export default function HolidayManagement({ holidays = [] }: HolidayManagementProps) {
  const handleAddHoliday = () => {
    alert('Add Holiday modal would open here');
  };

  const handleEditHoliday = (id: number) => {
    alert(`Edit holiday ${id}`);
  };

  const handleDeleteHoliday = (id: number) => {
    alert(`Delete holiday ${id}`);
  };

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'bg-blue-100 text-blue-700';
      case 'religious':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Holiday Management</h2>
        <button
          onClick={handleAddHoliday}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors mt-2 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add Holiday
        </button>
      </div>

      {holidays.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          No holidays found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Holiday</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday: any) => {
                const id = holiday._id || holiday.id;
                return (
                  <tr key={id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100 font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#94cb3d]" />
                      {holiday.name || holiday.title || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {holiday.date ? new Date(holiday.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getHolidayTypeColor(holiday.type || 'public')}`}>
                        {(holiday.type || 'Public').charAt(0).toUpperCase() + (holiday.type || 'Public').slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditHoliday(id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHoliday(id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
