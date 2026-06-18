'use client';

import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetMyPayslipsQuery } from '@/store/services/payslipApi';

export default function EmployeePayslips() {
  const params = useParams();
  const userId = params.userId as string;
  const [page] = useState(1);
  const [pageSize] = useState(10);

  // Redux API call
  const { data: payslipsData, isLoading } = useGetMyPayslipsQuery({
    page,
    pageSize,
  });

  const payslips = payslipsData?.data?.items || [];
  const loading = isLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading payslips...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Payslips</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">View and download your salary slips</p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="space-y-4">
          {payslips.map((payslip: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {payslip.period?.month} {payslip.period?.year}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Net Pay: {payslip.netPay || 'N/A'}
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
          {payslips.length === 0 && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No payslips found</p>
          )}
        </div>
      </div>
    </div>
  );
}
