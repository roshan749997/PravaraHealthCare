import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { NavLink } from 'react-router-dom'
import { api, formatCurrency } from '../utils/api.js'

// Employee Distribution colors
const employeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

export default function OtherExpenses() {
  const [expenseData, setExpenseData] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [sortBy, setSortBy] = useState('month');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortExpenses();
  }, [expenseData, searchTerm, filterYear, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        api.getExpenses(),
        api.getExpenseSummary()
      ]);
      
      if (expensesRes.success) {
        const expenses = expensesRes.data.map(exp => ({
          month: `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][exp.month - 1]} ${exp.year}`,
          officeRent: formatCurrency(exp.officeRent),
          utilities: formatCurrency(exp.lightBill),
          other: formatCurrency(exp.other),
          notes: exp.notes || '',
          _month: exp.month,
          _year: exp.year,
          _id: exp._id
        }));
        setExpenseData(expenses);
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

  const mockExpenseData = [
  {
    month: 'January 2025',
    officeRent: '₹2,20,000',
    utilities: '₹68,500',
    other: '₹45,200',
    notes: 'Onboarding event, facility maintenance',
  },
  {
    month: 'February 2025',
    officeRent: '₹2,20,000',
    utilities: '₹62,400',
    other: '₹38,900',
    notes: 'CRM vendor workshops, cafeteria upgrade',
  },
  {
    month: 'March 2025',
    officeRent: '₹2,20,000',
    utilities: '₹71,350',
    other: '₹52,800',
    notes: 'Quarterly compliance audits',
  },
  {
    month: 'April 2025',
    officeRent: '₹2,20,000',
    utilities: '₹65,900',
    other: '₹41,600',
    notes: 'Wellness program launch',
  },
  {
    month: 'May 2025',
    officeRent: '₹2,20,000',
    utilities: '₹67,100',
    other: '₹36,750',
    notes: 'IT infrastructure refresh',
  },
  {
    month: 'June 2025',
    officeRent: '₹2,20,000',
    utilities: '₹69,400',
    other: '₹48,300',
    notes: 'Staff training initiatives',
  },
]

  const filterAndSortExpenses = () => {
    let filtered = expenseData.filter(exp => {
      const matchesSearch = exp.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = exp.month.includes(filterYear.toString());
      return matchesSearch && matchesYear;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'month') {
        aVal = new Date(a.month);
        bVal = new Date(b.month);
      } else if (sortBy === 'total') {
        aVal = parseAmount(a.officeRent) + parseAmount(a.utilities) + parseAmount(a.other);
        bVal = parseAmount(b.officeRent) + parseAmount(b.utilities) + parseAmount(b.other);
      } else {
        aVal = parseAmount(a[sortBy]);
        bVal = parseAmount(b[sortBy]);
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredExpenses(filtered);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportExpenses = () => {
    try {
      const csvHeader = 'Month,Office Rent,Light Bill,Other Expenses,Total,Notes\n';
      const csvRows = filteredExpenses.map(exp => {
        const total = parseAmount(exp.officeRent) + parseAmount(exp.utilities) + parseAmount(exp.other);
        return `${exp.month},${exp.officeRent},${exp.utilities},${exp.other},${formatCurrency(total)},"${exp.notes || ''}"`;
      }).join('\n');
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_export_${filterYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting expenses data');
    }
  };

  const parseAmount = (value) => Number(value.replace(/[^0-9.]/g, ''))
  const totalOfficeRent = summary?.totalRent || filteredExpenses.reduce((sum, item) => sum + parseAmount(item.officeRent), 0)
  const totalUtilities = summary?.totalLightBill || filteredExpenses.reduce((sum, item) => sum + parseAmount(item.utilities), 0)
  const totalOther = summary?.totalOther || filteredExpenses.reduce((sum, item) => sum + parseAmount(item.other), 0)
const totalExpenses = totalOfficeRent + totalUtilities + totalOther
  const avgMonthly = summary?.avgMonthly || (filteredExpenses.length > 0 ? Math.round(totalExpenses / filteredExpenses.length) : 0)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="relative grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gray-700 sm:text-xs">
                Monthly expenses
              </span>
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Office Expenses Overview
              </h1>
              <p className="mt-3 max-w-2xl text-xs text-gray-600 sm:mt-4 sm:text-sm">
                Track monthly office expenses: Office Rent, Light Bill (Electricity), and Other Expenses. Monitor all operational costs for better financial planning and budget management.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <NavLink
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 sm:px-4 sm:text-sm"
                >
                  Back to dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 8.25 3 12l3.75 3.75M3 12h18" />
                  </svg>
                </NavLink>
                <NavLink
                  to="/payroll"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 sm:px-4 sm:text-sm"
                >
                  Payroll overview
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12l-3.75 3.75M21 12H3" />
                  </svg>
                </NavLink>
                <button
                  onClick={handleExportExpenses}
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
              ) : [{ label: 'Total tracked months', value: `${expenseData.length}`, detail: 'Rolling financial view', color: employeeColors[0] }, { label: 'Total expenses', value: formatCurrency(totalExpenses), detail: 'Rent + Light Bill + Other', color: employeeColors[1] }, { label: 'Average monthly', value: formatCurrency(avgMonthly), detail: 'Per month average', color: employeeColors[2] }].map((stat, idx) => {
                const bgColor = `${stat.color}15`;
                const borderColor = `${stat.color}40`;
                
                return (
                  <div 
                    key={stat.label} 
                    className="rounded-xl p-3 sm:p-4 transition-all hover:shadow-md"
                    style={{
                      backgroundColor: bgColor,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: borderColor,
                    }}
                  >
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gray-500 sm:text-xs">
                      {stat.label}
                    </p>
                    <p 
                      className="mt-2 text-xl font-semibold sm:text-2xl"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[0.65rem] font-medium text-gray-600 sm:text-xs">{stat.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {[
            { 
              label: 'Total rent (6 months)', 
              value: formatCurrency(totalOfficeRent),
              color: employeeColors[0],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              )
            }, 
            { 
              label: 'Light Bill', 
              value: formatCurrency(totalUtilities),
              color: employeeColors[1],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              )
            }, 
            { 
              label: 'Other overheads', 
              value: formatCurrency(totalOther),
              color: employeeColors[2],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )
            }, 
            { 
              label: 'Average monthly spend', 
              value: formatCurrency(Math.round(totalExpenses / expenseData.length)),
              color: employeeColors[3],
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
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

        {/* Search and Filter Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by month or notes..."
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
              <input
                type="number"
                placeholder="Year"
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 w-24"
              />
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterYear(new Date().getFullYear());
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-500 sm:text-xs">
                <tr>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('month')}
                  >
                    <div className="flex items-center gap-2">
                      Month
                      {sortBy === 'month' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('officeRent')}
                  >
                    <div className="flex items-center gap-2">
                      Office Rent
                      {sortBy === 'officeRent' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('utilities')}
                  >
                    <div className="flex items-center gap-2">
                      Light Bill
                      {sortBy === 'utilities' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('other')}
                  >
                    <div className="flex items-center gap-2">
                      Other Expenses
                      {sortBy === 'other' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`h-4 w-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12.75" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center">Loading...</td></tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center">No expenses found</td></tr>
                ) : filteredExpenses.map((month, idx) => {
                  const colorIndex = idx % employeeColors.length;
                  const bgColor = `${employeeColors[colorIndex]}15`;
                  const borderColor = `${employeeColors[colorIndex]}40`;
                  const textColor = employeeColors[colorIndex];
                  
                  return (
                    <tr key={month.month} className="transition-all hover:bg-gray-50 hover:shadow-sm">
                      <td className="px-4 py-3 font-semibold sm:px-6 sm:py-4">{month.month}</td>
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
                          {month.officeRent}
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
                          {month.utilities}
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
                          {month.other}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span 
                          className="inline-flex rounded-full px-3 py-1 text-[0.65rem] font-semibold sm:text-xs"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: borderColor,
                          }}
                        >
                          {month.notes}
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
  )
}

