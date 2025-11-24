import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

const API_BASE = 'http://localhost:5000/api';

export default function ManageAllowances() {
  const [allowances, setAllowances] = useState([]);
  const [filteredAllowances, setFilteredAllowances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: 'All',
    employeeId: 'All'
  });
  const [formData, setFormData] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    mobileRecharge: 0,
    petrolDiesel: { amount: 0, vehicleNumber: '' },
    incentive: 0,
    gifts: 0
  });

  useEffect(() => {
    fetchEmployees();
    fetchAllowances();
  }, []);

  useEffect(() => {
    filterAllowances();
  }, [allowances, filters]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE}/employees?status=Active`);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data.employees);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllowances = async () => {
    try {
      const response = await fetch(`${API_BASE}/allowances`);
      const data = await response.json();
      if (data.success) {
        setAllowances(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAllowances = () => {
    let filtered = allowances;
    if (filters.year) {
      filtered = filtered.filter(a => a.year === parseInt(filters.year));
    }
    if (filters.month !== 'All') {
      filtered = filtered.filter(a => a.month === parseInt(filters.month));
    }
    if (filters.employeeId !== 'All') {
      const empId = filters.employeeId;
      filtered = filtered.filter(a => {
        const emp = a.employeeId;
        return (emp?._id || emp) === empId;
      });
    }
    setFilteredAllowances(filtered);
  };

  const handleExport = () => {
    const csvHeader = 'Employee,Month,Year,Mobile Recharge,Petrol/Diesel,Vehicle Number,Incentive,Gifts,Total\n';
    const csvRows = filteredAllowances.map(all => {
      const emp = all.employeeId;
      const total = all.mobileRecharge + (all.petrolDiesel?.amount || 0) + all.incentive + all.gifts;
      return `"${emp?.name || 'N/A'}","${monthNames[all.month - 1]}",${all.year},${all.mobileRecharge},${all.petrolDiesel?.amount || 0},"${all.petrolDiesel?.vehicleNumber || ''}",${all.incentive},${all.gifts},${total}`;
    }).join('\n');
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allowances_${filters.year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAllowance 
        ? `${API_BASE}/allowances/${editingAllowance._id}`
        : `${API_BASE}/allowances`;
      const method = editingAllowance ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchAllowances();
        resetForm();
        alert(editingAllowance ? 'Allowance updated!' : 'Allowance added!');
      }
    } catch (error) {
      alert('Error saving allowance');
    }
  };

  const handleEdit = (allowance) => {
    setEditingAllowance(allowance);
    setFormData({
      employeeId: allowance.employeeId._id || allowance.employeeId,
      month: allowance.month,
      year: allowance.year,
      mobileRecharge: allowance.mobileRecharge,
      petrolDiesel: allowance.petrolDiesel || { amount: 0, vehicleNumber: '' },
      incentive: allowance.incentive,
      gifts: allowance.gifts
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this allowance?')) return;
    try {
      const response = await fetch(`${API_BASE}/allowances/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await fetchAllowances();
        alert('Allowance deleted');
      }
    } catch (error) {
      alert('Error deleting allowance');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      mobileRecharge: 0,
      petrolDiesel: { amount: 0, vehicleNumber: '' },
      incentive: 0,
      gifts: 0
    });
    setEditingAllowance(null);
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
            <h1 className="text-2xl font-semibold sm:text-3xl">Manage Allowances</h1>
            <p className="mt-2 text-sm text-gray-600">Mobile Recharge, Petrol/Diesel, Incentive, Gifts</p>
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
              {showForm ? 'Cancel' : '+ Add Allowance'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <select
                value={filters.employeeId}
                onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="All">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ year: new Date().getFullYear(), month: 'All', employeeId: 'All' })}
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
              {editingAllowance ? 'Edit Allowance' : 'Add New Allowance'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
                    ))}
                  </select>
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Recharge</label>
                  <input
                    type="number"
                    value={formData.mobileRecharge}
                    onChange={(e) => setFormData({ ...formData, mobileRecharge: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Petrol/Diesel Amount</label>
                  <input
                    type="number"
                    value={formData.petrolDiesel.amount}
                    onChange={(e) => setFormData({
                      ...formData,
                      petrolDiesel: { ...formData.petrolDiesel, amount: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={formData.petrolDiesel.vehicleNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      petrolDiesel: { ...formData.petrolDiesel, vehicleNumber: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="e.g., MH12 AB 1023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incentive</label>
                  <input
                    type="number"
                    value={formData.incentive}
                    onChange={(e) => setFormData({ ...formData, incentive: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gifts</label>
                  <input
                    type="number"
                    value={formData.gifts}
                    onChange={(e) => setFormData({ ...formData, gifts: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingAllowance ? 'Update Allowance' : 'Add Allowance'}
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Month/Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Petrol/Diesel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Incentive</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Gifts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-4 text-center">Loading...</td></tr>
                ) : filteredAllowances.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-4 text-center">No allowances found</td></tr>
                ) : (
                  filteredAllowances.map((all) => {
                    const emp = all.employeeId;
                    return (
                      <tr key={all._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{emp?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{emp?.employeeId || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {monthNames[all.month - 1]} {all.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(all.mobileRecharge)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(all.petrolDiesel?.amount || 0)}
                          {all.petrolDiesel?.vehicleNumber && (
                            <div className="text-xs text-gray-500">{all.petrolDiesel.vehicleNumber}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(all.incentive)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(all.gifts)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(all)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(all._id)}
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



