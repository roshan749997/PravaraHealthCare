import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

const API_BASE = 'http://localhost:5000/api';

export default function ManageExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: 'All'
  });
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    officeRent: 0,
    lightBill: 0,
    other: 0,
    notes: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses`);
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses;
    if (filters.year) {
      filtered = filtered.filter(e => e.year === parseInt(filters.year));
    }
    if (filters.month !== 'All') {
      filtered = filtered.filter(e => e.month === parseInt(filters.month));
    }
    setFilteredExpenses(filtered);
  };

  const handleExport = () => {
    const csvHeader = 'Month,Year,Office Rent,Light Bill,Other Expenses,Total,Notes\n';
    const csvRows = filteredExpenses.map(exp => {
      const total = exp.officeRent + exp.lightBill + exp.other;
      return `${monthNames[exp.month - 1]},${exp.year},${exp.officeRent},${exp.lightBill},${exp.other},${total},"${exp.notes || ''}"`;
    }).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${filters.year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingExpense 
        ? `${API_BASE}/expenses/${editingExpense._id}`
        : `${API_BASE}/expenses`;
      const method = editingExpense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchExpenses();
        resetForm();
        alert(editingExpense ? 'Expense updated!' : 'Expense added!');
      }
    } catch (error) {
      alert('Error saving expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      month: expense.month,
      year: expense.year,
      officeRent: expense.officeRent,
      lightBill: expense.lightBill,
      other: expense.other,
      notes: expense.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      const response = await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await fetchExpenses();
        alert('Expense deleted');
      }
    } catch (error) {
      alert('Error deleting expense');
    }
  };

  const resetForm = () => {
    setFormData({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      officeRent: 0,
      lightBill: 0,
      other: 0,
      notes: ''
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Manage Expenses</h1>
            <p className="mt-2 text-sm text-gray-600">Office Rent, Light Bill, Other Expenses</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              📥 Export CSV
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Expense'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="All">All Months</option>
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ year: new Date().getFullYear(), month: 'All' })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {showForm && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
                  <select
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    {monthNames.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Rent *</label>
                  <input
                    type="number"
                    required
                    value={formData.officeRent}
                    onChange={(e) => setFormData({ ...formData, officeRent: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Light Bill *</label>
                  <input
                    type="number"
                    required
                    value={formData.lightBill}
                    onChange={(e) => setFormData({ ...formData, lightBill: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Expenses *</label>
                  <input
                    type="number"
                    required
                    value={formData.other}
                    onChange={(e) => setFormData({ ...formData, other: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="e.g., Facility maintenance, training"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Month/Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Office Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Light Bill</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Other</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center">No expenses found</td></tr>
                ) : (
                  filteredExpenses.map((exp) => {
                    const total = exp.officeRent + exp.lightBill + exp.other;
                    return (
                      <tr key={exp._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {monthNames[exp.month - 1]} {exp.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(exp.officeRent)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(exp.lightBill)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(exp.other)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}



