import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { formatCurrency } from '../utils/api.js';

const API_BASE = 'http://localhost:5000/api';
const employeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try using direct fetch as fallback
      const response = await fetch(`${API_BASE}/employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.success) {
        const employeesData = data.data?.employees || data.data || [];
        if (Array.isArray(employeesData) && employeesData.length > 0) {
          setEmployees(employeesData.map(emp => ({
            id: emp.employeeId,
            name: emp.name,
            email: emp.email || '',
            phone: emp.phone || '',
            department: emp.department,
            designation: emp.designation || '',
            monthlySalary: formatCurrency(emp.salary?.monthly || 0),
            annualPackage: formatCurrency(emp.salary?.annual || 0),
            status: emp.status,
            joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : '',
            _id: emp._id
          })));
        } else {
          setError('No employees found in database. Please add employees from Admin Panel → Manage Employees.');
          setEmployees([]);
        }
      } else {
        setError(data?.message || 'Failed to fetch employees');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(`Error: ${error.message}`);
      }
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const parseAmount = (value) => Number(value.replace(/[^0-9.]/g, ''));

  const filteredAndSorted = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === 'All' || emp.department === filterDept;
      const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortBy === 'salary') {
        aVal = parseAmount(a.monthlySalary);
        bVal = parseAmount(b.monthlySalary);
      } else if (sortBy === 'department') {
        aVal = a.department;
        bVal = b.department;
      } else if (sortBy === 'joinDate') {
        aVal = new Date(a.joinDate);
        bVal = new Date(b.joinDate);
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [employees, searchTerm, sortBy, sortOrder, filterDept, filterStatus]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    try {
      const csvHeader = 'Employee ID,Name,Email,Phone,Department,Designation,Join Date,Monthly Salary,Annual Package,Status\n';
      const csvRows = filteredAndSorted.map(emp => {
        return `${emp.id},"${emp.name}","${emp.email}","${emp.phone}",${emp.department},"${emp.designation}",${emp.joinDate},${emp.monthlySalary},${emp.annualPackage},${emp.status}`;
      }).join('\n');
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting employees data');
    }
  };

  // Department distribution
  const departmentStats = filteredAndSorted.reduce((acc, emp) => {
    const dept = emp.department;
    if (!acc[dept]) {
      acc[dept] = { name: dept, count: 0, totalSalary: 0 };
    }
    acc[dept].count += 1;
    acc[dept].totalSalary += parseAmount(emp.monthlySalary);
    return acc;
  }, {});

  const departmentChartData = Object.values(departmentStats).map((dept, idx) => ({
    ...dept,
    avgSalary: Math.round(dept.totalSalary / dept.count),
    color: employeeColors[idx % employeeColors.length],
  }));

  const departments = ['All', ...new Set(employees.map(emp => emp.department))];
  const statuses = ['All', ...new Set(employees.map(emp => emp.status))];

  const totalEmployees = filteredAndSorted.length;
  const activeEmployees = filteredAndSorted.filter(e => e.status === 'Active').length;
  const totalMonthlySalary = filteredAndSorted.reduce((sum, emp) => sum + parseAmount(emp.monthlySalary), 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalMonthlySalary / totalEmployees) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gray-700 sm:text-xs">
                Employee Directory
              </span>
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Employee Management
              </h1>
              <p className="mt-3 max-w-2xl text-xs text-gray-600 sm:mt-4 sm:text-sm">
                View and manage all employees. Search, filter, and export employee data. Track employee information, salaries, and department distribution.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <NavLink
                  to="/admin/employees"
                  className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 sm:px-4 sm:text-sm"
                >
                  Manage Employees
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12l-3.75 3.75M21 12H3" />
                  </svg>
                </NavLink>
                <button
                  onClick={fetchEmployees}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 sm:px-4 sm:text-sm"
                >
                  🔄 Refresh
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.25 18.75a5.25 5.25 0 0 1 10.5 0M2.25 18.75a5.25 5.25 0 0 0 10.5 0m-10.5 0v-.75a5.25 5.25 0 0 1 5.25-5.25h1.5a5.25 5.25 0 0 1 5.25 5.25v.75m-10.5 0h10.5" />
                  </svg>
                </button>
                <button
                  onClick={handleExport}
                  disabled={filteredAndSorted.length === 0}
                  className="inline-flex items-center gap-2 rounded-md border border-green-600 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 sm:text-sm"
                >
                  📥 Export CSV
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:gap-4 sm:p-5">
              {loading ? (
                <div className="col-span-3 text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </div>
              ) : error ? (
                <div className="col-span-3 text-center py-4 text-red-600">
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={fetchEmployees}
                    className="mt-2 rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : [
                { label: 'Total Employees', value: totalEmployees, detail: `${activeEmployees} active` },
                { label: 'Total Monthly Salary', value: formatCurrency(totalMonthlySalary), detail: 'All employees combined' },
                { label: 'Average Salary', value: formatCurrency(avgSalary), detail: 'Per employee average' }
              ].map((stat, idx) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gray-500 sm:text-xs">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] font-medium text-gray-600 sm:text-xs">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {[
            { label: 'Total Employees', value: totalEmployees, color: employeeColors[0] },
            { label: 'Active Employees', value: activeEmployees, color: employeeColors[1] },
            { label: 'Total Salary', value: formatCurrency(totalMonthlySalary), color: employeeColors[2] },
            { label: 'Avg Salary', value: formatCurrency(avgSalary), color: employeeColors[3] }
          ].map((item, idx) => {
            const bgColor = `${item.color}15`;
            const borderColor = `${item.color}40`;
            
            return (
              <div 
                key={item.label} 
                className="rounded-lg bg-white p-4 sm:p-5 transition-all hover:shadow-lg"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: borderColor,
                }}
              >
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">{item.label}</p>
                <p 
                  className="mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm"
                  style={{
                    backgroundColor: bgColor,
                    color: item.color,
                  }}
                >
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Department Chart */}
        {departmentChartData.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 mb-4">Department Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value/1000}K`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {departmentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDept('All');
                  setFilterStatus('All');
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Employee Table */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-500 sm:text-xs">
                <tr>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Employee
                      {sortBy === 'name' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Contact</th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center gap-2">
                      Department
                      {sortBy === 'department' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('salary')}
                  >
                    <div className="flex items-center gap-2">
                      Monthly Salary
                      {sortBy === 'salary' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <span>Loading employees...</span>
                    </div>
                  </td></tr>
                ) : error ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 max-w-md mx-auto">
                      <p className="text-red-800 font-semibold mb-2">Error Loading Employees</p>
                      <p className="text-red-700 text-sm mb-3">{error}</p>
                      <button
                        onClick={fetchEmployees}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Retry
                      </button>
                    </div>
                  </td></tr>
                ) : filteredAndSorted.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center">
                    <div className="text-gray-500">
                      <p className="mb-2">No employees found</p>
                      {employees.length === 0 ? (
                        <p className="text-sm">Please add employees from <NavLink to="/admin/employees" className="text-blue-600 hover:underline">Admin Panel</NavLink></p>
                      ) : (
                        <p className="text-sm">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td></tr>
                ) : filteredAndSorted.map((employee, idx) => {
                  const colorIndex = idx % employeeColors.length;
                  const bgColor = `${employeeColors[colorIndex]}15`;
                  const borderColor = `${employeeColors[colorIndex]}40`;
                  const textColor = employeeColors[colorIndex];
                  
                  return (
                    <tr key={employee.id} className="transition-all hover:bg-gray-50 hover:shadow-sm">
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-3">
                          <span 
                            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm"
                            style={{ backgroundColor: employeeColors[colorIndex] }}
                          >
                            {employee.name
                              .split(' ')
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join('')}
                          </span>
                          <div>
                            <p className="text-sm font-semibold sm:text-base">{employee.name}</p>
                            <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">{employee.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="text-sm">
                          {employee.email && <p className="text-gray-900">{employee.email}</p>}
                          {employee.phone && <p className="text-gray-500">{employee.phone}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span 
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-medium"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                          }}
                        >
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span 
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: borderColor,
                          }}
                        >
                          {employee.monthlySalary}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span 
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            employee.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
