'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Eye, CheckCircle2, XCircle, Clock, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  type: 'Travel' | 'Medical' | 'Training' | 'Office Supplies' | 'Other';
  description: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
  receiptUrl?: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
}

export default function PayrollReimbursement() {
  const params = useParams();
  const userId = params.userId as string;

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      employeeEmail: 'john.smith@coralgroup.com',
      department: 'Engineering',
      type: 'Travel',
      description: 'Client meeting travel expenses - Mumbai to Delhi',
      amount: 15000,
      date: '2026-06-15',
      status: 'Pending',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      employeeEmail: 'sarah.johnson@coralgroup.com',
      department: 'HR',
      type: 'Medical',
      description: 'Medical reimbursement for doctor consultation',
      amount: 3500,
      date: '2026-06-10',
      status: 'Approved',
      approvedBy: 'HR Manager',
      approvedDate: '2026-06-12',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mike Brown',
      employeeEmail: 'mike.brown@coralgroup.com',
      department: 'Sales',
      type: 'Travel',
      description: 'Business trip accommodation - Bangalore',
      amount: 8000,
      date: '2026-06-08',
      status: 'Processed',
      approvedBy: 'Finance Manager',
      approvedDate: '2026-06-11',
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      employeeEmail: 'emily.davis@coralgroup.com',
      department: 'Engineering',
      type: 'Training',
      description: 'AWS Certification training fee',
      amount: 25000,
      date: '2026-06-05',
      status: 'Rejected',
      approvedBy: 'HR Manager',
      approvedDate: '2026-06-07',
      remarks: 'Budget exceeded for this quarter',
    },
    {
      id: '5',
      employeeId: 'EMP005',
      employeeName: 'David Wilson',
      employeeEmail: 'david.wilson@coralgroup.com',
      department: 'Finance',
      type: 'Office Supplies',
      description: 'Office supplies and equipment',
      amount: 4500,
      date: '2026-06-03',
      status: 'Approved',
      approvedBy: 'Accounts Manager',
      approvedDate: '2026-06-06',
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    employeeEmail: '',
    department: '',
    type: 'Travel' as Expense['type'],
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAdd = () => {
    if (!formData.employeeName || !formData.description || formData.amount === 0) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      ...formData,
      status: 'Pending',
    };

    setExpenses([newExpense, ...expenses]);
    setShowAddForm(false);
    setFormData({
      employeeId: '',
      employeeName: '',
      employeeEmail: '',
      department: '',
      type: 'Travel',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleApprove = (id: string) => {
    setExpenses(expenses.map(r => 
      r.id === id ? { ...r, status: 'Approved' as const, approvedBy: 'Accounts Manager', approvedDate: new Date().toISOString().split('T')[0] } : r
    ));
  };

  const handleReject = (id: string) => {
    const remarks = prompt('Please enter rejection reason:');
    if (remarks) {
      setExpenses(expenses.map(r => 
        r.id === id ? { ...r, status: 'Rejected' as const, approvedBy: 'Accounts Manager', approvedDate: new Date().toISOString().split('T')[0], remarks } : r
      ));
    }
  };

  const handleProcess = (id: string) => {
    setExpenses(expenses.map(r => 
      r.id === id ? { ...r, status: 'Processed' as const } : r
    ));
  };

  const handleView = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const filteredExpenses = expenses.filter(r => {
    const matchesDepartment = selectedDepartment === 'All' || r.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesType = selectedType === 'All' || r.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesStatus && matchesType && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = filteredExpenses.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);
  const approvedAmount = filteredExpenses.filter(r => r.status === 'Approved' || r.status === 'Processed').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Expense Management</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Manage employee expense requests</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Requests</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{filteredExpenses.length}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Pending</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{filteredExpenses.filter(r => r.status === 'Pending').length}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatCurrency(pendingAmount)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Approved/Processed</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{filteredExpenses.filter(r => r.status === 'Approved' || r.status === 'Processed').length}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatCurrency(approvedAmount)}</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add Expense Request</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.employeeEmail}
                onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Expense['type'] })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              >
                <option value="Travel">Travel</option>
                <option value="Medical">Medical</option>
                <option value="Training">Training</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Processed">Processed</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Types</option>
            <option value="Travel">Travel</option>
            <option value="Medical">Medical</option>
            <option value="Training">Training</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{expense.employeeName}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{expense.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {expense.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === 'Approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : expense.status === 'Processed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : expense.status === 'Rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(expense)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {expense.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(expense.id)}
                            className="text-[#94cb3d] hover:text-[#7ab52f]"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(expense.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {expense.status === 'Approved' && (
                        <button
                          onClick={() => handleProcess(expense.id)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Mark as Processed"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Expense Details</h2>
                <p className="text-zinc-600 dark:text-zinc-400">ID: {selectedExpense.id}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Employee Name</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Employee ID</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Department</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.department}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Type</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.type}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Amount</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Date</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Description</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.description}</p>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedExpense.status === 'Approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : selectedExpense.status === 'Processed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : selectedExpense.status === 'Rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {selectedExpense.status}
                    </span>
                  </div>
                  {selectedExpense.approvedBy && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Approved By</p>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.approvedBy}</p>
                    </div>
                  )}
                </div>
                {selectedExpense.approvedDate && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Approved Date</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{new Date(selectedExpense.approvedDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedExpense.remarks && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Remarks</p>
                    <p className="font-medium text-red-600 dark:text-red-400">{selectedExpense.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
