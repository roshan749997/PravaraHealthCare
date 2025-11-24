import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { NavLink } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    status: 'All'
  });
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    department: 'Other',
    designation: '',
    joinDate: '',
    salary: { monthly: 0, annual: 0 },
    status: 'Active'
  });

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.department !== 'All') params.append('department', filters.department);
      if (filters.status !== 'All') params.append('status', filters.status);
      
      const response = await fetch(`${API_BASE}/employees?${params}`);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data.employees);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEmployee 
        ? `${API_BASE}/employees/${editingEmployee._id}`
        : `${API_BASE}/employees`;
      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchEmployees();
        resetForm();
        alert(editingEmployee ? 'Employee updated!' : 'Employee added!');
      }
    } catch (error) {
      alert('Error saving employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department,
      designation: employee.designation || '',
      joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : '',
      salary: { monthly: employee.salary.monthly, annual: employee.salary.annual },
      status: employee.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this employee?')) return;
    try {
      const response = await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await fetchEmployees();
        alert('Employee deactivated');
      }
    } catch (error) {
      alert('Error deleting employee');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      department: 'Other',
      designation: '',
      joinDate: '',
      salary: { monthly: 0, annual: 0 },
      status: 'Active'
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees');
      return;
    }
    if (!confirm(`Update ${selectedEmployees.length} employees to ${status}?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/employees/bulk/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIds: selectedEmployees, status })
      });
      const data = await response.json();
      if (data.success) {
        await fetchEmployees();
        setSelectedEmployees([]);
        alert(`Updated ${data.data.modified} employees`);
      }
    } catch (error) {
      alert('Error updating employees');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees');
      return;
    }
    if (!confirm(`Deactivate ${selectedEmployees.length} employees?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/employees/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIds: selectedEmployees })
      });
      const data = await response.json();
      if (data.success) {
        await fetchEmployees();
        setSelectedEmployees([]);
        alert(`Deactivated ${data.data.modified} employees`);
      }
    } catch (error) {
      alert('Error deleting employees');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE}/employees/export/csv`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data');
    }
  };

  const toggleSelectEmployee = (id) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e._id));
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:gap-8 md:px-6 md:py-8 lg:gap-10 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="rounded-xl border border-gray-200 bg-white px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl">Manage Employees</h1>
              <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">Add, edit, or remove employees. Manage employee information and status.</p>
              <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-2 sm:p-3">
                <p className="text-xs text-blue-900 sm:text-sm">
                  💡 <strong>Tip:</strong> Use search and filters to find employees quickly. Select multiple employees for bulk actions.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleExport}
                className="flex-1 sm:flex-none rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 active:scale-95 transition-transform sm:px-4 sm:text-sm"
              >
                📥 Export CSV
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex-1 sm:flex-none rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-transform sm:px-4 sm:text-sm"
              >
                {showForm ? '✕ Cancel' : '+ Add Employee'}
              </button>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
          <h3 className="text-sm font-semibold mb-3 sm:text-base">Search & Filter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1 sm:text-sm">Search</label>
              <input
                type="text"
                placeholder="Name or Employee ID"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 sm:text-sm">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              >
                <option value="All">All Departments</option>
                <option value="Clinical">Clinical</option>
                <option value="Administrative">Administrative</option>
                <option value="Support Services">Support Services</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 sm:text-sm">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                onClick={() => setFilters({ search: '', department: 'All', status: 'All' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform sm:px-4 sm:text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-xs font-medium text-blue-900 sm:text-sm">
                ✓ {selectedEmployees.length} employee(s) selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('Active')}
                  className="flex-1 sm:flex-none rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 active:scale-95 transition-transform sm:px-3"
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Inactive')}
                  className="flex-1 sm:flex-none rounded-md bg-gray-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 active:scale-95 transition-transform sm:px-3"
                >
                  Set Inactive
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex-1 sm:flex-none rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 active:scale-95 transition-transform sm:px-3"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => setSelectedEmployees([])}
                  className="flex-1 sm:flex-none rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform sm:px-3"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>
        )}

        {showForm && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold sm:text-lg">
                {editingEmployee ? '✏️ Edit Employee' : '+ Add New Employee'}
              </h2>
              <p className="text-xs text-gray-600 mt-1 sm:text-sm">Fill in the employee details below. Fields marked with * are required.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="Clinical">Clinical</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Support Services">Support Services</option>
                    <option value="Technical">Technical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary *</label>
                  <input
                    type="number"
                    required
                    value={formData.salary.monthly}
                    onChange={(e) => setFormData({
                      ...formData,
                      salary: {
                        monthly: parseFloat(e.target.value) || 0,
                        annual: (parseFloat(e.target.value) || 0) * 12
                      }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Package</label>
                  <input
                    type="number"
                    value={formData.salary.annual}
                    onChange={(e) => setFormData({
                      ...formData,
                      salary: {
                        ...formData.salary,
                        annual: parseFloat(e.target.value) || 0
                      }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-transform sm:text-sm"
                >
                  {editingEmployee ? '✓ Update Employee' : '+ Add Employee'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Employees Table - Mobile Responsive */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle sm:px-0">
              <div className="overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.length === employees.length && employees.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 w-4 h-4"
                        />
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">Employee</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 hidden sm:table-cell sm:text-xs">Department</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell sm:text-xs">Salary</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">Status</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-3 py-8 text-center sm:px-6">
                          <div className="flex flex-col items-center gap-2">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <span className="text-xs text-gray-600 sm:text-sm">Loading employees...</span>
                          </div>
                        </td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-3 py-8 text-center sm:px-6">
                          <div className="text-gray-500">
                            <p className="text-xs sm:text-sm">No employees found</p>
                            <p className="text-[0.65rem] mt-1 sm:text-xs">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => (
                        <tr key={emp._id} className={`hover:bg-gray-50 ${selectedEmployees.includes(emp._id) ? 'bg-blue-50' : ''}`}>
                          <td className="px-3 py-3 whitespace-nowrap sm:px-6 sm:py-4">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(emp._id)}
                              onChange={() => toggleSelectEmployee(emp._id)}
                              className="rounded border-gray-300 w-4 h-4"
                            />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap sm:px-6 sm:py-4">
                            <div>
                              <div className="text-xs font-medium text-gray-900 sm:text-sm">{emp.name}</div>
                              <div className="text-[0.65rem] text-gray-500 sm:text-xs">{emp.employeeId}</div>
                              <div className="text-[0.65rem] text-gray-600 mt-1 sm:hidden">{emp.department} • {formatCurrency(emp.salary.monthly)}</div>
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900 hidden sm:table-cell sm:px-6 sm:py-4 sm:text-sm">{emp.department}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900 hidden md:table-cell sm:px-6 sm:py-4 sm:text-sm">{formatCurrency(emp.salary.monthly)}</td>
                          <td className="px-3 py-3 whitespace-nowrap sm:px-6 sm:py-4">
                            <span className={`px-2 py-1 text-[0.65rem] font-semibold rounded-full sm:text-xs ${
                              emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs font-medium sm:px-6 sm:py-4 sm:text-sm">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
                              <button
                                onClick={() => handleEdit(emp)}
                                className="text-blue-600 hover:text-blue-900 active:scale-95 transition-transform sm:mr-4"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(emp._id)}
                                className="text-red-600 hover:text-red-900 active:scale-95 transition-transform"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}



