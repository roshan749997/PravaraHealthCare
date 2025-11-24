import { useState, useMemo, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { NavLink } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { api, formatCurrency } from '../utils/api.js'

// Employee Distribution colors
const employeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

export default function TotalSalaries() {
  const [totalSalaryData, setTotalSalaryData] = useState([]);
  const [allowanceSummary, setAllowanceSummary] = useState(null);
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
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const [employeesRes, allowancesRes, summaryRes] = await Promise.all([
        api.getEmployees({ status: 'Active' }),
        api.getAllowances({ month: currentMonth, year: currentYear }),
        api.getAllowanceSummary({ month: currentMonth, year: currentYear })
      ]);

      if (employeesRes.success && allowancesRes.success) {
        const employees = employeesRes.data.employees;
        const allowances = allowancesRes.data;
        
        // Combine employee data with allowances
        const combinedData = employees.map(emp => {
          const allowance = allowances.find(a => 
            a.employeeId._id === emp._id || a.employeeId === emp._id
          );
          
          return {
            id: emp.employeeId,
            name: emp.name,
            monthlySalary: formatCurrency(emp.salary.monthly),
            mobileRecharge: formatCurrency(allowance?.mobileRecharge || 0),
            fuelExpense: `${formatCurrency(allowance?.petrolDiesel?.amount || 0)} · ${allowance?.petrolDiesel?.vehicleNumber || 'N/A'}`,
            monthlyIncentive: formatCurrency(allowance?.incentive || 0),
            giftVoucher: formatCurrency(allowance?.gifts || 0),
            department: emp.department,
            _id: emp._id
          };
        });
        
        setTotalSalaryData(combinedData);
      }

      if (summaryRes.success) {
        setAllowanceSummary(summaryRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockTotalSalaryData = [
  {
    id: 'EMP-001',
    name: 'Dr. Kavita Kulkarni',
    monthlySalary: '₹2,50,000',
    mobileRecharge: '₹999',
    fuelExpense: '₹12,500 · MH12 AB 1023',
    monthlyIncentive: '₹35,000',
    giftVoucher: '₹5,000',
    department: 'Clinical',
  },
  {
    id: 'EMP-002',
    name: 'Rahul Deshmukh',
    monthlySalary: '₹95,000',
    mobileRecharge: '₹599',
    fuelExpense: '₹7,200 · MH15 CD 7744',
    monthlyIncentive: '₹8,500',
    giftVoucher: '₹2,000',
    department: 'Administrative',
  },
  {
    id: 'EMP-003',
    name: 'Nikita Jadhav',
    monthlySalary: '₹80,000',
    mobileRecharge: '₹749',
    fuelExpense: '₹3,600 · Company Shuttle',
    monthlyIncentive: '₹6,500',
    giftVoucher: '₹1,500',
    department: 'Support Services',
  },
  {
    id: 'EMP-004',
    name: 'Prakash Patil',
    monthlySalary: '₹60,000',
    mobileRecharge: '₹499',
    fuelExpense: '₹5,800 · MH14 EF 9087',
    monthlyIncentive: '₹4,200',
    giftVoucher: '₹1,000',
    department: 'Technical',
  },
  {
    id: 'EMP-005',
    name: 'Sneha More',
    monthlySalary: '₹70,000',
    mobileRecharge: '₹599',
    fuelExpense: '₹2,100 · Hospital Transit',
    monthlyIncentive: '₹5,500',
    giftVoucher: '₹1,200',
    department: 'Administrative',
  },
  {
    id: 'EMP-006',
    name: 'Anil Gujar',
    monthlySalary: '₹55,000',
    mobileRecharge: '₹449',
    fuelExpense: '₹6,050 · MH12 GH 6655',
    monthlyIncentive: '₹3,800',
    giftVoucher: '₹900',
    department: 'Support Services',
  },
  {
    id: 'EMP-007',
    name: 'Dr. Manisha Pawar',
    monthlySalary: '₹1,80,000',
    mobileRecharge: '₹1,199',
    fuelExpense: '₹11,300 · MH15 JK 2201',
    monthlyIncentive: '₹22,000',
    giftVoucher: '₹4,500',
    department: 'Clinical',
  },
  {
    id: 'EMP-008',
    name: 'Sujata Kulkarni',
    monthlySalary: '₹65,000',
    mobileRecharge: '₹549',
    fuelExpense: '₹4,850 · MH12 LM 7788',
    monthlyIncentive: '₹4,900',
    giftVoucher: '₹1,300',
    department: 'Technical',
  },
  {
    id: 'EMP-009',
    name: 'Vikram Shinde',
    monthlySalary: '₹75,000',
    mobileRecharge: '₹699',
    fuelExpense: '₹6,900 · MH14 NP 5511',
    monthlyIncentive: '₹5,700',
    giftVoucher: '₹1,700',
    department: 'Administrative',
  },
  {
    id: 'EMP-010',
    name: 'Meera Sathe',
    monthlySalary: '₹68,000',
    mobileRecharge: '₹649',
    fuelExpense: '₹3,200 · Corporate Shuttle',
    monthlyIncentive: '₹5,100',
    giftVoucher: '₹1,400',
    department: 'Support Services',
  },
]

const parseCurrency = (value) => Number(value.replace(/[^0-9.]/g, ''))

const totalMonthlySalary = totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.monthlySalary), 0)
  const totalRecharge = allowanceSummary?.totalRecharge || totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.mobileRecharge), 0)
  const totalIncentives = allowanceSummary?.totalIncentive || totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.monthlyIncentive), 0)
  const totalVouchers = allowanceSummary?.totalGifts || totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.giftVoucher), 0)
  const totalFuel = allowanceSummary?.totalPetrol || totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.fuelExpense.split('·')[0]), 0)
const totalAllowances = totalRecharge + totalIncentives + totalVouchers + totalFuel

// Compensation breakdown chart data
const compensationBreakdown = [
  { name: 'Salary', value: totalMonthlySalary, color: employeeColors[0] },
  { name: 'Incentives', value: totalIncentives, color: employeeColors[1] },
  { name: 'Fuel', value: totalFuel, color: employeeColors[2] },
  { name: 'Recharge', value: totalRecharge, color: employeeColors[3] },
  { name: 'Vouchers', value: totalVouchers, color: employeeColors[4] },
];

// Department-wise total compensation
const departmentCompensation = totalSalaryData.reduce((acc, emp) => {
  const dept = emp.department;
  if (!acc[dept]) {
    acc[dept] = { name: dept, total: 0, count: 0 };
  }
  const empTotal = parseCurrency(emp.monthlySalary) + 
                   parseCurrency(emp.mobileRecharge) + 
                   parseCurrency(emp.monthlyIncentive) + 
                   parseCurrency(emp.giftVoucher) + 
                   parseCurrency(emp.fuelExpense.split('·')[0]);
  acc[dept].total += empTotal;
  acc[dept].count += 1;
  return acc;
}, {});

const departmentChartData = Object.values(departmentCompensation).map((dept, idx) => ({
  ...dept,
  avg: Math.round(dept.total / dept.count),
  color: employeeColors[idx % employeeColors.length],
}));

  const departments = ['All', ...new Set(totalSalaryData.map(emp => emp.department))]

  const filteredAndSorted = useMemo(() => {
    let filtered = totalSalaryData.filter(emp => {
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
        aVal = parseCurrency(a.monthlySalary)
        bVal = parseCurrency(b.monthlySalary)
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

  const handleExportTotalSalaries = () => {
    try {
      const csvHeader = 'Employee ID,Name,Department,Monthly Salary,Mobile Recharge,Petrol/Diesel,Vehicle Number,Incentive,Gifts\n';
      const csvRows = filteredAndSorted.map(emp => {
        const fuelParts = emp.fuelExpense.split('·');
        const fuelAmount = fuelParts[0]?.trim() || '₹0';
        const vehicleNumber = fuelParts[1]?.trim() || 'N/A';
        return `${emp.id},"${emp.name}",${emp.department},${emp.monthlySalary},${emp.mobileRecharge},${fuelAmount},"${vehicleNumber}",${emp.monthlyIncentive},${emp.giftVoucher}`;
      }).join('\n');
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `total_salaries_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting total salaries data');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="relative grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gray-700 sm:text-xs">
                Total salaries
              </span>
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Comprehensive compensation breakdown
              </h1>
              <p className="mt-3 max-w-2xl text-xs text-gray-600 sm:mt-4 sm:text-sm">
                Complete breakdown of all employee compensation: Salary, Incentives, Gifts, Petrol/Diesel expenses, and Mobile Recharge. Track every component for accurate financial management.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <NavLink
                  to="/payroll"
                  className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 sm:px-4 sm:text-sm"
                >
                  Back to payroll
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 8.25 3 12l3.75 3.75M3 12h18" />
                  </svg>
                </NavLink>
                <button 
                  onClick={handleExportTotalSalaries}
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
              ) : [{ label: 'Monthly salary payout', value: formatCurrency(totalMonthlySalary), detail: `${totalSalaryData.length} employees` }, { label: 'Monthly allowances', value: formatCurrency(totalAllowances), detail: 'All reimbursements combined' }, { label: 'Fuel reimbursements', value: formatCurrency(totalFuel), detail: 'With vehicle tracking' }].map((stat) => (
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
              label: 'Mobile Recharge', 
              value: formatCurrency(totalRecharge),
              color: employeeColors[0],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              )
            }, 
            { 
              label: 'Incentive', 
              value: formatCurrency(totalIncentives),
              color: employeeColors[1],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )
            }, 
            { 
              label: 'Gifts', 
              value: formatCurrency(totalVouchers),
              color: employeeColors[2],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v-1.5a2.25 2.25 0 0 0-1.5-2.143l-5-1.429a2.25 2.25 0 0 0-1.5 0l-5 1.429a2.25 2.25 0 0 0-1.5 2.143v1.5m9 0h.008v.008H12v-.008Zm-9 0H3m9 0v1.5m0 0v4.5m0-4.5H3m9 4.5v1.5m0 0H3m9 0h.008v.008H12V21Zm-9 0h1.5m13.5 0h1.5" />
                </svg>
              )
            }, 
            { 
              label: 'Employees covered', 
              value: `${totalSalaryData.length} team members`,
              color: employeeColors[3],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.375-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              )
            }
          ].map((item) => {
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
          {/* Compensation Breakdown */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 mb-4">Compensation Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compensationBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {compensationBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Compensation */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 mb-4">Department Compensation</h3>
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
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Mobile Recharge</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Petrol/Diesel</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Incentive</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Gifts</th>
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
                            <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">{employee.id}</p>
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
                          className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                          }}
                        >
                          {employee.mobileRecharge}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="inline-flex flex-col gap-1">
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
                            {employee.fuelExpense.split('·')[0].trim()}
                          </span>
                          <span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500">
                            {employee.fuelExpense.split('·')[1]?.trim() ?? '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span 
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                          }}
                        >
                          {employee.monthlyIncentive}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span 
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                          }}
                        >
                          {employee.giftVoucher}
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

