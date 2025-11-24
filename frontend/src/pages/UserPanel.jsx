import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:5000/api';

const employeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

export default function UserPanel() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const employeeId = user?.employeeId || '';
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated() || !user || user.type !== 'user') {
      navigate('/login', { replace: true });
      return;
    }

    if (employeeId) {
      fetchUserData();
    } else {
      setError('Employee ID not found. Please login again.');
      setLoading(false);
    }
  }, [employeeId, selectedMonth, selectedYear, isAuthenticated, user, navigate]);


  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify employee ID is present
      if (!employeeId) {
        setError('Employee ID not found in session. Please login again.');
        setLoading(false);
        return;
      }

      // Fetch only this employee's data - backend filters by employee._id
      const response = await fetch(`${API_BASE}/user/dashboard/${employeeId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Verify the returned employee matches logged-in user
        const returnedEmployeeId = data.data.employee?.employeeId;
        if (returnedEmployeeId && returnedEmployeeId.toUpperCase() === employeeId.toUpperCase()) {
          // All data is already filtered by backend for this specific employee
          setUserData(data.data);
          setError(null);
        } else {
          setError('Data mismatch. Please login again.');
          console.error('Employee ID mismatch:', { loggedIn: employeeId, returned: returnedEmployeeId });
        }
      } else {
        setError(data.message || 'Employee not found');
      }
    } catch (error) {
      setError('Error fetching user data. Please check if the backend server is running.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Prepare chart data
  const allowanceHistoryData = userData?.history?.allowances?.map(a => ({
    month: `${monthNames[a.month - 1]} ${a.year}`,
    mobile: a.mobileRecharge || 0,
    petrol: a.petrolDiesel?.amount || 0,
    incentive: a.incentive || 0,
    gifts: a.gifts || 0,
    total: (a.mobileRecharge || 0) + (a.petrolDiesel?.amount || 0) + (a.incentive || 0) + (a.gifts || 0)
  })) || [];

  const payrollHistoryData = userData?.history?.payrolls?.map(p => ({
    month: `${monthNames[p.month - 1]} ${p.year}`,
    salary: p.salary || 0,
    total: p.totalCompensation || 0
  })) || [];

  const currentAllowanceBreakdown = userData?.currentMonth?.allowance ? [
    { name: 'Mobile Recharge', value: userData.currentMonth.allowance.mobileRecharge || 0, color: employeeColors[0] },
    { name: 'Petrol/Diesel', value: userData.currentMonth.allowance.petrolDiesel?.amount || 0, color: employeeColors[1] },
    { name: 'Incentive', value: userData.currentMonth.allowance.incentive || 0, color: employeeColors[2] },
    { name: 'Gifts', value: userData.currentMonth.allowance.gifts || 0, color: employeeColors[3] }
  ].filter(item => item.value > 0) : [];

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  if (error || !userData) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
          <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
              <p className="text-red-700 mb-6">{error || 'Employee not found'}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const employee = userData.employee;
  const currentMonth = userData.currentMonth;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:gap-8 md:px-6 md:py-8 lg:gap-10 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-6 shadow-sm sm:rounded-3xl sm:px-6 sm:py-8 md:px-8 md:py-10">
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gray-700 sm:text-xs">
                My Profile - Personal Information Only
              </span>
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                {employee.name}
              </h1>
              <p className="mt-3 max-w-2xl text-xs text-gray-600 sm:mt-4 sm:text-sm">
                Employee ID: <span className="font-semibold">{employee.employeeId}</span> | 
                Department: <span className="font-semibold">{employee.department}</span> | 
                Designation: <span className="font-semibold">{employee.designation || 'N/A'}</span>
              </p>
              <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-2 sm:p-3">
                <p className="text-xs text-green-900 sm:text-sm">
                  ✅ <strong>Verified:</strong> You are viewing only your personal data. This page shows only information related to Employee ID: <strong>{employee.employeeId}</strong>
                </p>
              </div>
              {employee.joinDate && (
                <p className="mt-2 text-xs text-gray-500">
                  Joined: {new Date(employee.joinDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:gap-4 sm:p-4 md:p-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-[0.65rem] md:text-xs">Monthly Salary</p>
                <p className="mt-2 text-lg font-semibold sm:text-xl md:text-2xl">{formatCurrency(currentMonth.salary)}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-[0.65rem] md:text-xs">Current Allowances</p>
                <p className="mt-2 text-lg font-semibold sm:text-xl md:text-2xl">{formatCurrency(currentMonth.allowances)}</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-blue-700 sm:text-[0.65rem] md:text-xs">Total Compensation</p>
                <p className="mt-2 text-lg font-semibold sm:text-xl md:text-2xl text-blue-700">{formatCurrency(currentMonth.totalCompensation)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{employee.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{employee.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-gray-900">{employee.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {employee.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary</label>
              <p className="text-gray-900 font-semibold">{formatCurrency(employee.salary.monthly)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Package</label>
              <p className="text-gray-900 font-semibold">{formatCurrency(employee.salary.annual)}</p>
            </div>
          </div>
        </section>

        {/* Current Month Details */}
        <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          {/* Current Allowances */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">
              Current Month Allowances ({monthNames[selectedMonth - 1]} {selectedYear})
            </h2>
            {currentMonth.allowance ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Mobile Recharge</span>
                  <span className="font-semibold">{formatCurrency(currentMonth.allowance.mobileRecharge || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Petrol/Diesel</span>
                    {currentMonth.allowance.petrolDiesel?.vehicleNumber && (
                      <p className="text-xs text-gray-500">{currentMonth.allowance.petrolDiesel.vehicleNumber}</p>
                    )}
                  </div>
                  <span className="font-semibold">{formatCurrency(currentMonth.allowance.petrolDiesel?.amount || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Incentive</span>
                  <span className="font-semibold">{formatCurrency(currentMonth.allowance.incentive || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Gifts</span>
                  <span className="font-semibold">{formatCurrency(currentMonth.allowance.gifts || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-semibold text-blue-900">Total Allowances</span>
                  <span className="font-bold text-blue-700">{formatCurrency(currentMonth.allowances)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No allowances recorded for this month</p>
            )}
          </div>

          {/* Allowance Breakdown Chart */}
          {currentAllowanceBreakdown.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Allowance Breakdown</h2>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentAllowanceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {currentAllowanceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Allowance History Chart */}
        {allowanceHistoryData.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Allowance History (Last 6 Months)</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allowanceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="mobile" stackId="a" fill={employeeColors[0]} name="Mobile Recharge" />
                  <Bar dataKey="petrol" stackId="a" fill={employeeColors[1]} name="Petrol/Diesel" />
                  <Bar dataKey="incentive" stackId="a" fill={employeeColors[2]} name="Incentive" />
                  <Bar dataKey="gifts" stackId="a" fill={employeeColors[3]} name="Gifts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Payroll History */}
        {payrollHistoryData.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Payroll History (Last 6 Months)</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="salary" stroke={employeeColors[0]} strokeWidth={2} name="Salary" />
                  <Line type="monotone" dataKey="total" stroke={employeeColors[1]} strokeWidth={2} name="Total Compensation" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Allowance History Table */}
        {userData.history.allowances.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Allowance History</h2>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3 sm:text-xs">Month/Year</th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 hidden sm:table-cell sm:px-6 sm:py-3 sm:text-xs">Mobile</th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell sm:px-6 sm:py-3 sm:text-xs">Petrol/Diesel</th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell sm:px-6 sm:py-3 sm:text-xs">Incentive</th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 hidden lg:table-cell sm:px-6 sm:py-3 sm:text-xs">Gifts</th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-medium uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3 sm:text-xs">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.history.allowances.map((allowance, idx) => {
                    const total = (allowance.mobileRecharge || 0) + 
                                  (allowance.petrolDiesel?.amount || 0) + 
                                  (allowance.incentive || 0) + 
                                  (allowance.gifts || 0);
                    return (
                      <tr key={allowance._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {monthNames[allowance.month - 1]} {allowance.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(allowance.mobileRecharge || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(allowance.petrolDiesel?.amount || 0)}
                          {allowance.petrolDiesel?.vehicleNumber && (
                            <div className="text-xs text-gray-500">{allowance.petrolDiesel.vehicleNumber}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(allowance.incentive || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(allowance.gifts || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Payroll History Table */}
        {userData.history.payrolls.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Payroll History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Month/Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total Compensation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.history.payrolls.map((payroll) => (
                    <tr key={payroll._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {monthNames[payroll.month - 1]} {payroll.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payroll.salary || 0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(payroll.totalCompensation || 0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payroll.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          payroll.status === 'Processed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payroll.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

