'use client';

import { useState } from 'react';
import { Search, Filter, Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, Users, Printer, Mail, Clock, CheckCircle2, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PayrollReports() {
  const params = useParams();
  const userId = params.userId as string;

  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('This Month');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedEmployeeType, setSelectedEmployeeType] = useState('All');

  // Payroll summary data
  const payrollSummary = {
    totalPayroll: 8250000,
    totalEmployees: 125,
    averageSalary: 66000,
    taxDeductions: 1245000,
    netSalaryPaid: 7005000,
    bonusPaid: 450000,
    deductions: 825000,
  };

  // Department-wise payroll
  const departmentPayroll = [
    { department: 'Engineering', employees: 35, totalSalary: 2450000, averageSalary: 70000 },
    { department: 'Sales', employees: 25, totalSalary: 1750000, averageSalary: 70000 },
    { department: 'Marketing', employees: 20, totalSalary: 1200000, averageSalary: 60000 },
    { department: 'HR', employees: 15, totalSalary: 900000, averageSalary: 60000 },
    { department: 'Finance', employees: 12, totalSalary: 840000, averageSalary: 70000 },
    { department: 'Operations', employees: 18, totalSalary: 1110000, averageSalary: 61667 },
  ];

  // Monthly payroll trend
  const monthlyPayroll = [
    { month: 'Jan', grossSalary: 8000000, netSalary: 6800000, deductions: 1200000 },
    { month: 'Feb', grossSalary: 8100000, netSalary: 6885000, deductions: 1215000 },
    { month: 'Mar', grossSalary: 8250000, netSalary: 7005000, deductions: 1245000 },
    { month: 'Apr', grossSalary: 8200000, netSalary: 6970000, deductions: 1230000 },
    { month: 'May', grossSalary: 8300000, netSalary: 7055000, deductions: 1245000 },
    { month: 'Jun', grossSalary: 8250000, netSalary: 7005000, deductions: 1245000 },
  ];

  // Tax summary
  const taxSummary = {
    incomeTax: 820000,
    professionalTax: 125000,
    providentFund: 300000,
    esi: 0,
    totalDeductions: 1245000,
  };

  // Salary breakdown
  const salaryBreakdown = [
    { component: 'Basic Salary', amount: 4125000, percentage: 50 },
    { component: 'HRA', amount: 1650000, percentage: 20 },
    { component: 'Special Allowance', amount: 1237500, percentage: 15 },
    { component: 'Medical Allowance', amount: 412500, percentage: 5 },
    { component: 'Conveyance Allowance', amount: 412500, percentage: 5 },
    { component: 'Other Allowances', amount: 412500, percentage: 5 },
  ];

  // Attendance data
  const attendanceData = [
    { department: 'Engineering', present: 95, absent: 3, leave: 2 },
    { department: 'Sales', present: 92, absent: 5, leave: 3 },
    { department: 'Marketing', present: 90, absent: 6, leave: 4 },
    { department: 'HR', present: 96, absent: 2, leave: 2 },
    { department: 'Finance', present: 94, absent: 3, leave: 3 },
    { department: 'Operations', present: 91, absent: 5, leave: 4 },
  ];

  // Deduction details
  const deductionDetails = [
    { type: 'Income Tax', amount: 820000, employees: 125 },
    { type: 'Professional Tax', amount: 125000, employees: 125 },
    { type: 'Provident Fund', amount: 300000, employees: 100 },
    { type: 'Health Insurance', amount: 150000, employees: 125 },
    { type: 'Loan Recovery', amount: 50000, employees: 10 },
  ];

  // Bonus data
  const bonusData = [
    { employeeId: 'EMP001', employeeName: 'John Smith', department: 'Engineering', bonusType: 'Performance', amount: 50000, date: '2026-06-15' },
    { employeeId: 'EMP002', employeeName: 'Sarah Johnson', department: 'HR', bonusType: 'Quarterly', amount: 30000, date: '2026-06-15' },
    { employeeId: 'EMP003', employeeName: 'Mike Brown', department: 'Sales', bonusType: 'Sales Target', amount: 75000, date: '2026-06-15' },
    { employeeId: 'EMP004', employeeName: 'Emily Davis', department: 'Engineering', bonusType: 'Performance', amount: 45000, date: '2026-06-15' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Payroll Reports</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Track salary payments, deductions, taxes, and payroll analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <FileText className="h-4 w-4" />
            Export Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors">
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Payroll</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.totalPayroll)}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Employees</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{payrollSummary.totalEmployees}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Avg Salary</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.averageSalary)}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Tax Deductions</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.taxDeductions)}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Net Salary Paid</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.netSalaryPaid)}</p>
            </div>
            <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Bonus Paid</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.bonusPaid)}</p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
            <option value="Custom">Custom</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
          <select
            value={selectedEmployeeType}
            onChange={(e) => setSelectedEmployeeType(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Employee Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
      </div>

      {/* Payroll Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payroll Trend */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Monthly Payroll Trend</h3>
          <div className="space-y-3">
            {monthlyPayroll.map((data) => (
              <div key={data.month} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">{data.month}</span>
                  <span className="text-zinc-900 dark:text-zinc-50">Gross: {formatCurrency(data.grossSalary)} | Net: {formatCurrency(data.netSalary)}</span>
                </div>
                <div className="flex gap-1 h-4">
                  <div className="bg-blue-500 rounded" style={{ width: `${(data.grossSalary / 9000000) * 100}%` }}></div>
                  <div className="bg-green-500 rounded" style={{ width: `${(data.netSalary / 9000000) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-zinc-600 dark:text-zinc-400">Gross Salary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-zinc-600 dark:text-zinc-400">Net Salary</span>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Salary Breakdown</h3>
          <div className="space-y-3">
            {salaryBreakdown.map((item) => (
              <div key={item.component} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">{item.component}</span>
                  <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(item.amount)} ({item.percentage}%)</span>
                </div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#94cb3d] rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-700">
        <nav className="flex gap-4 overflow-x-auto">
          {['Overview', 'Salary Summary', 'Tax Reports', 'Attendance', 'Deductions', 'Bonus & Incentives', 'Compliance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Payroll Overview</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Department</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Employees</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Total Salary</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Avg Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {departmentPayroll.map((dept) => (
                    <tr key={dept.department}>
                      <td className="py-3 px-3 text-sm text-zinc-900 dark:text-zinc-50">{dept.department}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-600 dark:text-zinc-400">{dept.employees}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-900 dark:text-zinc-50">{formatCurrency(dept.totalSalary)}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-600 dark:text-zinc-400">{formatCurrency(dept.averageSalary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Salary Summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Salary Summary</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-3">Salary Components</h4>
                <div className="space-y-2">
                  {salaryBreakdown.map((item) => (
                    <div key={item.component} className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">{item.component}</span>
                      <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-3">Payroll Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Gross Salary</span>
                    <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.totalPayroll)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Total Deductions</span>
                    <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.deductions)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t border-zinc-200 dark:border-zinc-700 pt-2">
                    <span className="text-zinc-900 dark:text-zinc-50">Net Salary Paid</span>
                    <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(payrollSummary.netSalaryPaid)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tax Reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Tax Reports</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Income Tax</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(taxSummary.incomeTax)}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Professional Tax</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(taxSummary.professionalTax)}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Provident Fund</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(taxSummary.providentFund)}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Deductions</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(taxSummary.totalDeductions)}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Tax Type</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Amount</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Employees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {deductionDetails.map((deduction) => (
                    <tr key={deduction.type}>
                      <td className="py-3 px-3 text-sm text-zinc-900 dark:text-zinc-50">{deduction.type}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-900 dark:text-zinc-50">{formatCurrency(deduction.amount)}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-600 dark:text-zinc-400">{deduction.employees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Attendance' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Attendance Report</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Department</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Present %</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Absent %</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Leave %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {attendanceData.map((data) => (
                    <tr key={data.department}>
                      <td className="py-3 px-3 text-sm text-zinc-900 dark:text-zinc-50">{data.department}</td>
                      <td className="py-3 px-3 text-sm text-right">
                        <span className="text-green-600 dark:text-green-400">{data.present}%</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-right">
                        <span className="text-red-600 dark:text-red-400">{data.absent}%</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-right">
                        <span className="text-amber-600 dark:text-amber-400">{data.leave}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Deductions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Deductions Report</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Deduction Type</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Amount</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Employees Affected</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Per Employee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {deductionDetails.map((deduction) => (
                    <tr key={deduction.type}>
                      <td className="py-3 px-3 text-sm text-zinc-900 dark:text-zinc-50">{deduction.type}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-900 dark:text-zinc-50">{formatCurrency(deduction.amount)}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-600 dark:text-zinc-400">{deduction.employees}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-600 dark:text-zinc-400">{formatCurrency(deduction.amount / deduction.employees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Bonus & Incentives' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Bonus & Incentives</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Employee</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Department</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Bonus Type</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Amount</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {bonusData.map((bonus) => (
                    <tr key={bonus.employeeId}>
                      <td className="py-3 px-3 text-sm text-zinc-900 dark:text-zinc-50">{bonus.employeeName}</td>
                      <td className="py-3 px-3 text-sm text-zinc-600 dark:text-zinc-400">{bonus.department}</td>
                      <td className="py-3 px-3 text-sm text-zinc-600 dark:text-zinc-400">{bonus.bonusType}</td>
                      <td className="py-3 px-3 text-sm text-right text-zinc-900 dark:text-zinc-50">{formatCurrency(bonus.amount)}</td>
                      <td className="py-3 px-3 text-sm text-zinc-600 dark:text-zinc-400">{new Date(bonus.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Compliance' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Compliance Reports</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">PF Compliance</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Provident Fund contributions and compliance status</p>
                <button className="text-sm text-[#94cb3d] hover:text-[#7ab52f]">View Details</button>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">ESI Compliance</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Employee State Insurance compliance status</p>
                <button className="text-sm text-[#94cb3d] hover:text-[#7ab52f]">View Details</button>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">PT Compliance</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Professional Tax compliance status</p>
                <button className="text-sm text-[#94cb3d] hover:text-[#7ab52f]">View Details</button>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">TDS Compliance</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Tax Deducted at Source compliance status</p>
                <button className="text-sm text-[#94cb3d] hover:text-[#7ab52f]">View Details</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Trail */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-900 dark:text-zinc-50">Payroll Processed</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Accounts Manager - 2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-900 dark:text-zinc-50">Report Downloaded</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Finance Head - 5 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-900 dark:text-zinc-50">Bonus Processed</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">HR Manager - 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
