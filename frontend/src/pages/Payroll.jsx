import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { NavLink } from 'react-router-dom'

const payrollData = [
  {
    id: 'EMP-001',
    name: 'Dr. Kavita Kulkarni',
    monthlySalary: '₹2,50,000',
    annualPackage: '₹30,00,000',
  },
  {
    id: 'EMP-002',
    name: 'Rahul Deshmukh',
    monthlySalary: '₹95,000',
    annualPackage: '₹11,40,000',
  },
  {
    id: 'EMP-003',
    name: 'Nikita Jadhav',
    monthlySalary: '₹80,000',
    annualPackage: '₹9,60,000',
  },
  {
    id: 'EMP-004',
    name: 'Prakash Patil',
    monthlySalary: '₹60,000',
    annualPackage: '₹7,20,000',
  },
  {
    id: 'EMP-005',
    name: 'Sneha More',
    monthlySalary: '₹70,000',
    annualPackage: '₹8,40,000',
  },
  {
    id: 'EMP-006',
    name: 'Anil Gujar',
    monthlySalary: '₹55,000',
    annualPackage: '₹6,60,000',
  },
  {
    id: 'EMP-007',
    name: 'Dr. Manisha Pawar',
    monthlySalary: '₹1,80,000',
    annualPackage: '₹21,60,000',
  },
  {
    id: 'EMP-008',
    name: 'Sujata Kulkarni',
    monthlySalary: '₹65,000',
    annualPackage: '₹7,80,000',
  },
  {
    id: 'EMP-009',
    name: 'Vikram Shinde',
    monthlySalary: '₹75,000',
    annualPackage: '₹9,00,000',
  },
  {
    id: 'EMP-010',
    name: 'Meera Sathe',
    monthlySalary: '₹68,000',
    annualPackage: '₹8,16,000',
  },
]

const parseAmount = (value) => Number(value.replace(/[^0-9.]/g, ''))
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const totalMonthly = payrollData.reduce((sum, employee) => sum + parseAmount(employee.monthlySalary), 0)
const totalAnnual = payrollData.reduce((sum, employee) => sum + parseAmount(employee.annualPackage), 0)
const averageMonthly = Math.round(totalMonthly / payrollData.length)
const highestMonthly = payrollData.reduce(
  (max, employee) => Math.max(max, parseAmount(employee.monthlySalary)),
  0,
)

export default function Payroll() {
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
                Review monthly salary commitments, annual packages, and growth trends across Pravara Health Care. Use the insights below to plan payouts, manage incentives, and align budgets.
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
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:gap-4 sm:p-5">
              {[{ label: 'Monthly payroll', value: formatCurrency(totalMonthly), detail: '+4.2% vs last cycle' }, { label: 'Annualised payroll', value: formatCurrency(totalAnnual), detail: 'Including bonuses & perks' }, { label: 'Highest monthly pay', value: formatCurrency(highestMonthly), detail: '₹1.8L at Oncology' }].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gray-500 sm:text-xs">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] font-medium text-gray-600 sm:text-xs">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-4 sm:gap-4">
          {[{ label: 'Average monthly pay', value: formatCurrency(averageMonthly), tone: 'bg-[#A020F0]/20 text-[#A020F0]' }, { label: 'Median salary band', value: '₹72K', tone: 'bg-[#D400FF]/20 text-[#D400FF]' }, { label: 'Variable payout fund', value: '₹2.4L', tone: 'bg-[#FF00CC]/20 text-[#FF00CC]' }, { label: 'Payroll completion', value: '92%', tone: 'bg-[#A020F0]/20 text-[#A020F0]' }].map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">{item.label}</p>
              <p className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${item.tone} sm:text-sm`}>{item.value}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-500 sm:text-xs">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Employee</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Employee ID</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Monthly Salary</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Annual Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {payrollData.map((employee) => (
                  <tr key={employee.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
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
                    <td className="px-4 py-3 text-gray-700 sm:px-6 sm:py-4">{employee.id}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{employee.monthlySalary}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{employee.annualPackage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

