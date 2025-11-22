import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { NavLink } from 'react-router-dom'

// Employee Distribution colors
const employeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

const expenseData = [
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

const parseAmount = (value) => Number(value.replace(/[^0-9.]/g, ''))
const totalOfficeRent = expenseData.reduce((sum, item) => sum + parseAmount(item.officeRent), 0)
const totalUtilities = expenseData.reduce((sum, item) => sum + parseAmount(item.utilities), 0)
const totalOther = expenseData.reduce((sum, item) => sum + parseAmount(item.other), 0)
const totalExpenses = totalOfficeRent + totalUtilities + totalOther

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function OtherExpenses() {
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
                Other operational expenditure overview
              </h1>
              <p className="mt-3 max-w-2xl text-xs text-gray-600 sm:mt-4 sm:text-sm">
                Track recurring office rent commitments, utility consumption, and discretionary spend across Pravara
                Health Care facilities. Use this overview to anticipate upcoming payouts and optimize cost efficiency.
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
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:gap-4 sm:p-5">
              {[{ label: 'Total tracked months', value: `${expenseData.length}`, detail: 'Rolling financial view', color: employeeColors[0] }, { label: 'Current quarter spend', value: formatCurrency(totalExpenses), detail: 'Rent + utilities + misc', color: employeeColors[1] }, { label: 'Utilities variance', value: '+6.8%', detail: 'Compared to previous quarter', color: employeeColors[2] }].map((stat, idx) => {
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
              label: 'Total utilities', 
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

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-500 sm:text-xs">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Month</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Office Rent</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Light & Utility</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Other Expenses</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {expenseData.map((month, idx) => {
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

