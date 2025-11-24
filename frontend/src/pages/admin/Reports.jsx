import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const API_BASE = 'http://localhost:5000/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Reports() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startMonth: 1,
    startYear: new Date().getFullYear(),
    endMonth: 12,
    endYear: new Date().getFullYear()
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startMonth: dateRange.startMonth,
        startYear: dateRange.startYear,
        endMonth: dateRange.endMonth,
        endYear: dateRange.endYear
      });
      const response = await fetch(`${API_BASE}/admin/analytics/overview?${params}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const deptData = analytics?.departmentBreakdown ? Object.entries(analytics.departmentBreakdown).map(([dept, data]) => ({
    name: dept,
    employees: data.count,
    salary: data.totalSalary
  })) : [];

  const expenseTrendData = analytics?.monthlyTrends?.expenses || [];
  const allowanceTrendData = analytics?.monthlyTrends?.allowances || [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Advanced Reports & Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">Comprehensive financial and employee analytics</p>
          </div>
        </div>

        {/* Date Range Filter */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">Date Range</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Month</label>
              <select
                value={dateRange.startMonth}
                onChange={(e) => setDateRange({ ...dateRange, startMonth: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
              <input
                type="number"
                value={dateRange.startYear}
                onChange={(e) => setDateRange({ ...dateRange, startYear: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Month</label>
              <select
                value={dateRange.endMonth}
                onChange={(e) => setDateRange({ ...dateRange, endMonth: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
              <input
                type="number"
                value={dateRange.endYear}
                onChange={(e) => setDateRange({ ...dateRange, endYear: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-8">Loading analytics...</div>
        ) : analytics && (
          <>
            {/* Summary Cards */}
            <section className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              <div className="rounded-lg bg-white p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.totalEmployees}</p>
              </div>
              <div className="rounded-lg bg-white p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Total Salary</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(analytics.totalSalary)}</p>
              </div>
              <div className="rounded-lg bg-white p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(analytics.totalExpenses)}</p>
              </div>
              <div className="rounded-lg bg-white p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">{formatCurrency(analytics.totalCost)}</p>
              </div>
            </section>

            {/* Department Breakdown */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Department Breakdown</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="employees" fill="#8884d8" name="Employees" />
                      <Bar dataKey="salary" fill="#82ca9d" name="Total Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deptData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="salary"
                      >
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Monthly Trends */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="total" data={expenseTrendData} stroke="#ef4444" name="Expenses" />
                  <Line type="monotone" dataKey="total" data={allowanceTrendData} stroke="#3b82f6" name="Allowances" />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Department Details Table */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Department Details</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Avg Salary</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deptData.map((dept) => (
                      <tr key={dept.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.employees}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(dept.salary)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(dept.salary / dept.employees)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

