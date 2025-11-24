import { useState, useMemo, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { NavLink } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { api, formatCurrency } from '../utils/api.js'

// Employee Distribution colors
const employeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

export default function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterDept, setFilterDept] = useState('All')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes, summaryRes] = await Promise.all([
        api.getEmployees({ status: 'Active' }),
        api.getPayrollSummary()
      ]);
      
      if (employeesRes.success) {
        const employees = employeesRes.data.employees.map(emp => ({
          id: emp.employeeId,
          name: emp.name,
          monthlySalary: formatCurrency(emp.salary.monthly),
          annualPackage: formatCurrency(emp.salary.annual),
          department: emp.department,
          status: emp.status,
          joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : '',
          _id: emp._id
        }));
        setPayrollData(employees);
      }
      
      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockPayrollData = [
  {
    id: 'EMP-001',
    name: 'Dr. Kavita Kulkarni',
    monthlySalary: '₹2,50,000',
    annualPackage: '₹30,00,000',
    department: 'Clinical',
    status: 'Active',
    joinDate: '2020-01-15',
  },
  {
    id: 'EMP-002',
    name: 'Rahul Deshmukh',
    monthlySalary: '₹95,000',
    annualPackage: '₹11,40,000',
    department: 'Administrative',
    status: 'Active',
    joinDate: '2021-03-20',
  },
  {
    id: 'EMP-003',
    name: 'Nikita Jadhav',
    monthlySalary: '₹80,000',
    annualPackage: '₹9,60,000',
    department: 'Support Services',
    status: 'Active',
    joinDate: '2021-06-10',
  },
  {
    id: 'EMP-004',
    name: 'Prakash Patil',
    monthlySalary: '₹60,000',
    annualPackage: '₹7,20,000',
    department: 'Technical',
    status: 'Active',
    joinDate: '2022-02-05',
  },
  {
    id: 'EMP-005',
    name: 'Sneha More',
    monthlySalary: '₹70,000',
    annualPackage: '₹8,40,000',
    department: 'Administrative',
    status: 'Active',
    joinDate: '2021-09-12',
  },
  {
    id: 'EMP-006',
    name: 'Anil Gujar',
    monthlySalary: '₹55,000',
    annualPackage: '₹6,60,000',
    department: 'Support Services',
    status: 'Active',
    joinDate: '2022-05-18',
  },
  {
    id: 'EMP-007',
    name: 'Dr. Manisha Pawar',
    monthlySalary: '₹1,80,000',
    annualPackage: '₹21,60,000',
    department: 'Clinical',
    status: 'Active',
    joinDate: '2019-11-25',
  },
  {
    id: 'EMP-008',
    name: 'Sujata Kulkarni',
    monthlySalary: '₹65,000',
    annualPackage: '₹7,80,000',
    department: 'Technical',
    status: 'Active',
    joinDate: '2021-12-08',
  },
  {
    id: 'EMP-009',
    name: 'Vikram Shinde',
    monthlySalary: '₹75,000',
    annualPackage: '₹9,00,000',
    department: 'Administrative',
    status: 'Active',
    joinDate: '2021-07-30',
  },
  {
    id: 'EMP-010',
    name: 'Meera Sathe',
    monthlySalary: '₹68,000',
    annualPackage: '₹8,16,000',
    department: 'Support Services',
    status: 'Active',
    joinDate: '2022-01-14',
  },
]

const parseAmount = (value) => Number(value.replace(/[^0-9.]/g, ''))

  const totalMonthly = summary?.monthlyPayroll || payrollData.reduce((sum, employee) => sum + parseAmount(employee.monthlySalary), 0)
  const totalAnnual = summary?.annualPayroll || payrollData.reduce((sum, employee) => sum + parseAmount(employee.annualPackage), 0)
  const averageMonthly = summary?.averageMonthlyPay || (payrollData.length > 0 ? Math.round(totalMonthly / payrollData.length) : 0)
  const highestMonthly = summary?.highestMonthlyPay || payrollData.reduce(
  (max, employee) => Math.max(max, parseAmount(employee.monthlySalary)),
  0,
)

// Department-wise salary distribution
const departmentStats = payrollData.reduce((acc, emp) => {
  const dept = emp.department;
  if (!acc[dept]) {
    acc[dept] = { name: dept, count: 0, total: 0, avg: 0 };
  }
  acc[dept].count += 1;
  acc[dept].total += parseAmount(emp.monthlySalary);
  return acc;
}, {});

const departmentChartData = Object.values(departmentStats).map((dept, idx) => ({
  ...dept,
  avg: Math.round(dept.total / dept.count),
  color: employeeColors[idx % employeeColors.length],
}));

const salaryRangeData = [
    { range: '₹50K-₹70K', count: payrollData.filter(e => {
      const sal = parseAmount(e.monthlySalary);
      return sal >= 50000 && sal < 70000;
    }).length, color: employeeColors[0] },
    { range: '₹70K-₹1L', count: payrollData.filter(e => {
      const sal = parseAmount(e.monthlySalary);
      return sal >= 70000 && sal < 100000;
    }).length, color: employeeColors[1] },
    { range: '₹1L-₹2L', count: payrollData.filter(e => {
      const sal = parseAmount(e.monthlySalary);
      return sal >= 100000 && sal < 200000;
    }).length, color: employeeColors[2] },
    { range: '₹2L+', count: payrollData.filter(e => {
      const sal = parseAmount(e.monthlySalary);
      return sal >= 200000;
    }).length, color: employeeColors[3] },
  ];

  const departments = ['All', ...new Set(payrollData.map(emp => emp.department))]

  const filteredAndSorted = useMemo(() => {
    let filtered = payrollData.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = filterDept === 'All' || emp.department === filterDept
      return matchesSearch && matchesDept
    })

    filtered.sort((a, b) => {
      let aVal, bVal
      if (sortBy === 'name') {
        aVal = a.name
        bVal = b.name
      } else if (sortBy === 'salary') {
        aVal = parseAmount(a.monthlySalary)
        bVal = parseAmount(b.monthlySalary)
      } else if (sortBy === 'department') {
        aVal = a.department
        bVal = b.department
      } else {
        aVal = a.id
        bVal = b.id
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    return filtered
  }, [searchTerm, sortBy, sortOrder, filterDept])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleExportPayroll = () => {
    try {
      const csvHeader = 'Employee ID,Name,Department,Monthly Salary,Annual Package,Status\n';
      const csvRows = filteredAndSorted.map(emp => {
        return `${emp.id},"${emp.name}",${emp.department},${emp.monthlySalary},${emp.annualPackage},${emp.status}`;
      }).join('\n');
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting payroll data');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gray-700 sm:text-xs">
                Payroll overview
              </span>
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Employee compensation summary
              </h1>
              <p className="mt-3 max-w-2xl text-xs text-gray-600 sm:mt-4 sm:text-sm">
                Review monthly salary commitments, annual packages, incentives, gifts, and allowances. Track all employee compensation components including salary, incentives, gifts, petrol/diesel, and mobile recharge expenses.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <NavLink
                  to="/total-salaries"
                  className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 sm:px-4 sm:text-sm"
                >
                  View total salaries
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12l-3.75 3.75M21 12H3" />
                  </svg>
                </NavLink>
                <NavLink
                  to="/employees"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 sm:px-4 sm:text-sm"
                >
                  Employee directory
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </NavLink>
                <button
                  onClick={handleExportPayroll}
                  className="inline-flex items-center gap-2 rounded-md border border-green-600 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 sm:px-4 sm:text-sm"
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
                <div className="col-span-3 text-center py-4">Loading...</div>
              ) : [{ label: 'Monthly payroll', value: formatCurrency(totalMonthly), detail: `${payrollData.length} employees` }, { label: 'Annualised payroll', value: formatCurrency(totalAnnual), detail: 'Including bonuses & perks' }, { label: 'Highest monthly pay', value: formatCurrency(highestMonthly), detail: 'Top employee salary' }].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gray-500 sm:text-xs">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] font-medium text-gray-600 sm:text-xs">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {[
            { 
              label: 'Average monthly pay', 
              value: formatCurrency(averageMonthly), 
              color: employeeColors[0],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )
            }, 
            { 
              label: 'Median salary band', 
              value: '₹72K', 
              color: employeeColors[1],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              )
            }, 
            { 
              label: 'Variable payout fund', 
              value: '₹2.4L', 
              color: employeeColors[2],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
              )
            }, 
            { 
              label: 'Payroll completion', 
              value: '92%', 
              color: employeeColors[3],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )
            }
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
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="rounded-md p-2"
                    style={{
                      backgroundColor: bgColor,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                </div>
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

        {/* Charts Section */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* Department Salary Distribution */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 mb-4">Department Salary Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                    {departmentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Salary Range Distribution */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 mb-4">Salary Range Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salaryRangeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => `${range}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {salaryRangeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
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
            </div>
          </div>
        </section>

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
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      Employee ID
                      {sortBy === 'id' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Department</th>
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
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Annual Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {filteredAndSorted.map((employee, idx) => {
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
                            <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">Payroll cycle</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 sm:px-6 sm:py-4 font-medium">{employee.id}</td>
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
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: borderColor,
                          }}
                        >
                          {employee.annualPackage}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredAndSorted.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No employees found matching your search criteria.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

