'use client';

import { useState } from 'react';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState<'payroll' | 'bank' | 'pf' | 'esi' | 'tax' | 'template'>('payroll');

  const [payrollSettings, setPayrollSettings] = useState({
    cycle: 'Monthly',
    paymentDay: '25',
    cutoffDay: '20',
    calculationMethod: 'Actual Days',
  });

  const [bankSettings, setBankSettings] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const [pfSettings, setPfSettings] = useState({
    employerContribution: '12',
    employeeContribution: '12',
    pfNumber: '',
  });

  const [esiSettings, setEsiSettings] = useState({
    employerContribution: '3.25',
    employeeContribution: '0.75',
    esiNumber: '',
  });

  const [taxSettings, setTaxSettings] = useState({
    tdsRate: '10',
    professionalTax: '200',
  });

  const handleSave = () => {
    alert('Settings saved successfully');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Account Settings
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Configure payroll, bank, PF, ESI, and tax settings
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <nav className="flex gap-4 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'payroll'
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              Payroll Cycle
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'bank'
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              Bank Account
            </button>
            <button
              onClick={() => setActiveTab('pf')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'pf'
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              PF Settings
            </button>
            <button
              onClick={() => setActiveTab('esi')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'esi'
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              ESI Settings
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'tax'
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              Tax Rules
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'template'
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              Payslip Template
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'payroll' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Payroll Cycle Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Payroll Cycle
                  </label>
                  <select
                    value={payrollSettings.cycle}
                    onChange={(e) => setPayrollSettings({ ...payrollSettings, cycle: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Salary Payment Day
                  </label>
                  <input
                    type="number"
                    value={payrollSettings.paymentDay}
                    onChange={(e) => setPayrollSettings({ ...payrollSettings, paymentDay: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="e.g., 25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Attendance Cutoff Day
                  </label>
                  <input
                    type="number"
                    value={payrollSettings.cutoffDay}
                    onChange={(e) => setPayrollSettings({ ...payrollSettings, cutoffDay: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="e.g., 20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Calculation Method
                  </label>
                  <select
                    value={payrollSettings.calculationMethod}
                    onChange={(e) => setPayrollSettings({ ...payrollSettings, calculationMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                  >
                    <option value="Actual Days">Actual Days</option>
                    <option value="Fixed Days">Fixed Days (30)</option>
                    <option value="Calendar Days">Calendar Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Bank Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankSettings.accountNumber}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={bankSettings.ifscCode}
                    onChange={(e) => setBankSettings({ ...bankSettings, ifscCode: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="Enter IFSC code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="Enter bank name"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pf' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">PF Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Employer Contribution Rate (%)
                  </label>
                  <input
                    type="number"
                    value={pfSettings.employerContribution}
                    onChange={(e) => setPfSettings({ ...pfSettings, employerContribution: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Employee Contribution Rate (%)
                  </label>
                  <input
                    type="number"
                    value={pfSettings.employeeContribution}
                    onChange={(e) => setPfSettings({ ...pfSettings, employeeContribution: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    PF Establishment Number
                  </label>
                  <input
                    type="text"
                    value={pfSettings.pfNumber}
                    onChange={(e) => setPfSettings({ ...pfSettings, pfNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="Enter PF number"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'esi' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">ESI Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Employer Contribution Rate (%)
                  </label>
                  <input
                    type="number"
                    value={esiSettings.employerContribution}
                    onChange={(e) => setEsiSettings({ ...esiSettings, employerContribution: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="3.25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Employee Contribution Rate (%)
                  </label>
                  <input
                    type="number"
                    value={esiSettings.employeeContribution}
                    onChange={(e) => setEsiSettings({ ...esiSettings, employeeContribution: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="0.75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    ESI Establishment Number
                  </label>
                  <input
                    type="text"
                    value={esiSettings.esiNumber}
                    onChange={(e) => setEsiSettings({ ...esiSettings, esiNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="Enter ESI number"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Tax Rules</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Default TDS Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxSettings.tdsRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, tdsRate: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Professional Tax Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={taxSettings.professionalTax}
                    onChange={(e) => setTaxSettings({ ...taxSettings, professionalTax: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    placeholder="200"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Payslip Template</h3>
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Select a payslip template format
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border-2 border-[#94cb3d] rounded-lg p-4 cursor-pointer bg-[#94cb3d] bg-opacity-10">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📄</div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Standard</p>
                      </div>
                    </div>
                    <div className="border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📋</div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Detailed</p>
                      </div>
                    </div>
                    <div className="border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🎨</div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Custom</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#94cb3d] border-zinc-300 rounded focus:ring-[#94cb3d]" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Include company logo</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#94cb3d] border-zinc-300 rounded focus:ring-[#94cb3d]" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Include YTD summary</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
