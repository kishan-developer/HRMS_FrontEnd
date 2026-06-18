'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Download, Calendar, TrendingUp, TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'Salary' | 'Travel' | 'Training' | 'Office' | 'Equipment' | 'Other';
  description: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Cheque';
  approvedBy?: string;
  receiptUrl?: string;
}

export default function Expenses() {
  const params = useParams();
  const userId = params.userId as string;

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Engineering',
      category: 'Salary',
      description: 'June 2026 Salary Payment',
      amount: 107960,
      date: '2026-06-30',
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      approvedBy: 'Accounts Manager',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      department: 'HR',
      category: 'Salary',
      description: 'June 2026 Salary Payment',
      amount: 87742,
      date: '2026-06-30',
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      approvedBy: 'Accounts Manager',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mike Brown',
      department: 'Sales',
      category: 'Travel',
      description: 'Client Meeting Travel - Mumbai',
      amount: 15000,
      date: '2026-06-25',
      status: 'Pending',
      paymentMethod: 'Credit Card',
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      department: 'Engineering',
      category: 'Training',
      description: 'AWS Certification Training',
      amount: 25000,
      date: '2026-06-20',
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      approvedBy: 'HR Manager',
    },
    {
      id: '5',
      employeeId: 'EMP005',
      employeeName: 'David Wilson',
      department: 'Finance',
      category: 'Equipment',
      description: 'Office Equipment Purchase',
      amount: 45000,
      date: '2026-06-15',
      status: 'Rejected',
      paymentMethod: 'Cheque',
      approvedBy: 'Finance Manager',
    },
    {
      id: '6',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Engineering',
      category: 'Office',
      description: 'Office Supplies',
      amount: 5000,
      date: '2026-06-10',
      status: 'Approved',
      paymentMethod: 'Cash',
      approvedBy: 'Office Manager',
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    category: 'Salary' as Expense['category'],
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer' as Expense['paymentMethod'],
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
      department: '',
      category: 'Salary',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const handleView = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesDepartment = selectedDepartment === 'All' || e.department === selectedDepartment;
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesCategory && matchesStatus && matchesSearch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = filteredExpenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-8 space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Expenses</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Track and manage company expenses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Expenses</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Approved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(approvedExpenses)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(pendingExpenses)}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add New Expense</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              ×
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
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              >
                <option value="Salary">Salary</option>
                <option value="Travel">Travel</option>
                <option value="Training">Training</option>
                <option value="Office">Office</option>
                <option value="Equipment">Equipment</option>
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
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Expense['paymentMethod'] })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
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
              Add Expense
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
                placeholder="Search expenses..."
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Categories</option>
            <option value="Salary">Salary</option>
            <option value="Travel">Travel</option>
            <option value="Training">Training</option>
            <option value="Office">Office</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Dept
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{expense.employeeName}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{expense.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {expense.department}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {expense.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">
                    {expense.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {expense.paymentMethod}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === 'Approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : expense.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(expense)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 max-w-2xl w-full my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Expense Details</h2>
                <p className="text-zinc-600 dark:text-zinc-400">ID: {selectedExpense.id}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
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
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Category</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Amount</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Date</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Payment Method</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedExpense.status === 'Approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : selectedExpense.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {selectedExpense.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Description</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.description}</p>
              </div>

              {selectedExpense.approvedBy && (
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Approved By</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedExpense.approvedBy}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
