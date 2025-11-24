import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { NavLink } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:gap-8 md:px-6 md:py-8 lg:gap-10 lg:px-8 lg:py-10">
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-6 shadow-sm sm:rounded-3xl sm:px-6 sm:py-8 md:px-8 md:py-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-gray-700 sm:px-3 sm:py-1 sm:text-[0.6rem] md:text-xs">
              Admin Panel
            </span>
            <h1 className="mt-3 text-xl font-semibold sm:mt-4 sm:text-2xl md:text-3xl lg:text-4xl">
              Employee Management System
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-600 sm:mt-3 sm:text-sm">
              Manage employees, salaries, allowances, and expenses. Update all information from this central admin panel.
            </p>
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3 sm:p-4">
              <p className="text-xs font-medium text-blue-900 sm:text-sm">
                💡 <strong>Tip:</strong> Use the navigation cards below to access different management sections. All features are available on mobile devices.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading statistics...</p>
          </div>
        ) : stats && (
          <>
            <section className="grid gap-2 grid-cols-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
              {[
                { label: 'Total Employees', value: stats.totalEmployees, color: '#F59E0B', icon: '👥' },
                { label: 'Total Salary', value: formatCurrency(stats.totalSalary), color: '#DC2626', icon: '💰' },
                { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses), color: '#84CC16', icon: '📊' },
                { label: 'Total Allowances', value: formatCurrency(stats.totalAllowances), color: '#06B6D4', icon: '🎁' }
              ].map((stat, idx) => {
                const bgColor = `${stat.color}15`;
                const borderColor = `${stat.color}40`;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-white p-3 transition-all hover:shadow-md sm:p-4 md:p-5"
                    style={{
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: borderColor,
                    }}
                  >
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-[0.65rem] md:text-xs">
                      {stat.label}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg sm:text-xl">{stat.icon}</span>
                      <p
                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm"
                        style={{
                          backgroundColor: bgColor,
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Additional Stats */}
            <section className="grid gap-2 grid-cols-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
              {[
                { label: 'Processed Payrolls', value: stats.processedPayrolls || 0, color: '#10B981', icon: '✅' },
                { label: 'Pending Payrolls', value: stats.pendingPayrolls || 0, color: '#F59E0B', icon: '⏳' },
                { label: 'Total Cost', value: formatCurrency((stats.totalSalary || 0) + (stats.totalExpenses || 0) + (stats.totalAllowances || 0)), color: '#8B5CF6', icon: '💳' },
                { label: 'Avg Salary/Employee', value: stats.totalEmployees > 0 ? formatCurrency((stats.totalSalary || 0) / stats.totalEmployees) : formatCurrency(0), color: '#3B82F6', icon: '📈' }
              ].map((stat, idx) => {
                const bgColor = `${stat.color}15`;
                const borderColor = `${stat.color}40`;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-white p-3 transition-all hover:shadow-md sm:p-4 md:p-5"
                    style={{
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: borderColor,
                    }}
                  >
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-[0.65rem] md:text-xs">
                      {stat.label}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg sm:text-xl">{stat.icon}</span>
                      <p
                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm"
                        style={{
                          backgroundColor: bgColor,
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Quick Actions */}
            <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Quick Actions</h2>
              <p className="text-xs text-gray-600 mb-4 sm:text-sm">Common tasks you can perform quickly</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                <NavLink
                  to="/admin/employees"
                  className="rounded-lg border border-gray-200 p-3 text-center hover:bg-blue-50 hover:border-blue-300 transition-all sm:p-4"
                >
                  <div className="text-xl mb-1 sm:text-2xl sm:mb-2">👥</div>
                  <div className="text-xs font-medium sm:text-sm">Add Employee</div>
                  <div className="text-[0.65rem] text-gray-500 mt-1 hidden sm:block">Manage employees</div>
                </NavLink>
                <NavLink
                  to="/admin/payroll"
                  className="rounded-lg border border-gray-200 p-3 text-center hover:bg-green-50 hover:border-green-300 transition-all sm:p-4"
                >
                  <div className="text-xl mb-1 sm:text-2xl sm:mb-2">💰</div>
                  <div className="text-xs font-medium sm:text-sm">Process Payroll</div>
                  <div className="text-[0.65rem] text-gray-500 mt-1 hidden sm:block">Generate payroll</div>
                </NavLink>
                <NavLink
                  to="/admin/reports"
                  className="rounded-lg border border-gray-200 p-3 text-center hover:bg-purple-50 hover:border-purple-300 transition-all sm:p-4"
                >
                  <div className="text-xl mb-1 sm:text-2xl sm:mb-2">📊</div>
                  <div className="text-xs font-medium sm:text-sm">View Reports</div>
                  <div className="text-[0.65rem] text-gray-500 mt-1 hidden sm:block">Analytics & insights</div>
                </NavLink>
                <NavLink
                  to="/admin/settings"
                  className="rounded-lg border border-gray-200 p-3 text-center hover:bg-gray-50 hover:border-gray-300 transition-all sm:p-4"
                >
                  <div className="text-xl mb-1 sm:text-2xl sm:mb-2">⚙️</div>
                  <div className="text-xs font-medium sm:text-sm">Settings</div>
                  <div className="text-[0.65rem] text-gray-500 mt-1 hidden sm:block">Configure system</div>
                </NavLink>
              </div>
            </section>
          </>
        )}

        {/* Admin Navigation */}
        <section className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NavLink
            to="/admin/employees"
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-all sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-blue-50 p-2.5 sm:p-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.375-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">Manage Employees</h3>
                <p className="text-xs text-gray-600 sm:text-sm mt-1">Add, edit, or remove employees. View employee details and manage their information.</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/admin/expenses"
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-all sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-green-50 p-2.5 sm:p-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">Manage Expenses</h3>
                <p className="text-xs text-gray-600 sm:text-sm mt-1">Office rent, light bill, and other operational expenses. Track monthly spending.</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/admin/allowances"
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-all sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-purple-50 p-2.5 sm:p-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">Manage Allowances</h3>
                <p className="text-xs text-gray-600 sm:text-sm mt-1">Mobile recharge, petrol/diesel, incentives, and gifts for employees.</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/admin/payroll"
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-all sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-orange-50 p-2.5 sm:p-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">Process Payroll</h3>
                <p className="text-xs text-gray-600 sm:text-sm mt-1">Generate monthly payroll for all employees. View payroll history.</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-all sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-indigo-50 p-2.5 sm:p-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">Reports & Analytics</h3>
                <p className="text-xs text-gray-600 sm:text-sm mt-1">Advanced reports, charts, and insights. Analyze financial data.</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-all sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-gray-50 p-2.5 sm:p-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">Settings</h3>
                <p className="text-xs text-gray-600 sm:text-sm mt-1">System configuration, company details, and preferences.</p>
              </div>
            </div>
          </NavLink>
        </section>
      </main>
      <Footer />
    </div>
  );
}



