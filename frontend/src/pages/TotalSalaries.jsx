import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { NavLink } from 'react-router-dom'

const totalSalaryData = [
  {
    id: 'EMP-001',
    name: 'Dr. Kavita Kulkarni',
    monthlySalary: '₹2,50,000',
    mobileRecharge: '₹999',
    fuelExpense: '₹12,500 · MH12 AB 1023',
    monthlyIncentive: '₹35,000',
    giftVoucher: '₹5,000',
  },
  {
    id: 'EMP-002',
    name: 'Rahul Deshmukh',
    monthlySalary: '₹95,000',
    mobileRecharge: '₹599',
    fuelExpense: '₹7,200 · MH15 CD 7744',
    monthlyIncentive: '₹8,500',
    giftVoucher: '₹2,000',
  },
  {
    id: 'EMP-003',
    name: 'Nikita Jadhav',
    monthlySalary: '₹80,000',
    mobileRecharge: '₹749',
    fuelExpense: '₹3,600 · Company Shuttle',
    monthlyIncentive: '₹6,500',
    giftVoucher: '₹1,500',
  },
  {
    id: 'EMP-004',
    name: 'Prakash Patil',
    monthlySalary: '₹60,000',
    mobileRecharge: '₹499',
    fuelExpense: '₹5,800 · MH14 EF 9087',
    monthlyIncentive: '₹4,200',
    giftVoucher: '₹1,000',
  },
  {
    id: 'EMP-005',
    name: 'Sneha More',
    monthlySalary: '₹70,000',
    mobileRecharge: '₹599',
    fuelExpense: '₹2,100 · Hospital Transit',
    monthlyIncentive: '₹5,500',
    giftVoucher: '₹1,200',
  },
  {
    id: 'EMP-006',
    name: 'Anil Gujar',
    monthlySalary: '₹55,000',
    mobileRecharge: '₹449',
    fuelExpense: '₹6,050 · MH12 GH 6655',
    monthlyIncentive: '₹3,800',
    giftVoucher: '₹900',
  },
  {
    id: 'EMP-007',
    name: 'Dr. Manisha Pawar',
    monthlySalary: '₹1,80,000',
    mobileRecharge: '₹1,199',
    fuelExpense: '₹11,300 · MH15 JK 2201',
    monthlyIncentive: '₹22,000',
    giftVoucher: '₹4,500',
  },
  {
    id: 'EMP-008',
    name: 'Sujata Kulkarni',
    monthlySalary: '₹65,000',
    mobileRecharge: '₹549',
    fuelExpense: '₹4,850 · MH12 LM 7788',
    monthlyIncentive: '₹4,900',
    giftVoucher: '₹1,300',
  },
  {
    id: 'EMP-009',
    name: 'Vikram Shinde',
    monthlySalary: '₹75,000',
    mobileRecharge: '₹699',
    fuelExpense: '₹6,900 · MH14 NP 5511',
    monthlyIncentive: '₹5,700',
    giftVoucher: '₹1,700',
  },
  {
    id: 'EMP-010',
    name: 'Meera Sathe',
    monthlySalary: '₹68,000',
    mobileRecharge: '₹649',
    fuelExpense: '₹3,200 · Corporate Shuttle',
    monthlyIncentive: '₹5,100',
    giftVoucher: '₹1,400',
  },
]

const parseCurrency = (value) => Number(value.replace(/[^0-9.]/g, ''))
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const totalMonthlySalary = totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.monthlySalary), 0)
const totalRecharge = totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.mobileRecharge), 0)
const totalIncentives = totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.monthlyIncentive), 0)
const totalVouchers = totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.giftVoucher), 0)
const totalFuel = totalSalaryData.reduce((sum, employee) => sum + parseCurrency(employee.fuelExpense.split('·')[0]), 0)

export default function TotalSalaries() {
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
                Audit every salary component including allowances, benefits, vehicle reimbursements, and vouchers. Keep transparency high and approvals swift for Pravara Health Care leadership.
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
                <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 sm:px-4 sm:text-sm">
                  Export summary
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12M12 3.75v12m0 0 3.75-3.75M12 15.75 8.25 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:gap-4 sm:p-5">
              {[{ label: 'Monthly salary payout', value: formatCurrency(totalMonthlySalary), detail: '+5.1% QoQ' }, { label: 'Monthly allowances', value: formatCurrency(totalRecharge + totalIncentives + totalVouchers + totalFuel), detail: 'All reimbursements combined' }, { label: 'Fuel reimbursements', value: formatCurrency(totalFuel), detail: 'With vehicle tracking' }].map((stat) => (
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
          {[{ label: 'Recharge support', value: formatCurrency(totalRecharge) }, { label: 'Monthly incentives', value: formatCurrency(totalIncentives) }, { label: 'Gift vouchers', value: formatCurrency(totalVouchers) }, { label: 'Employees covered', value: `${totalSalaryData.length} team members` }].map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">{item.label}</p>
              <p className={`mt-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm`}>{item.value}</p>
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
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Mobile Recharge</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Fuel & Vehicle</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Monthly Incentive</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">Gift Vouchers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {totalSalaryData.map((employee) => (
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
                          <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 sm:px-6 sm:py-4">{employee.id}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{employee.monthlySalary}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{employee.mobileRecharge}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span className="inline-flex flex-col gap-1 text-[0.65rem] text-gray-700 sm:text-xs">
                        <span className="text-sm font-semibold">{employee.fuelExpense.split('·')[0].trim()}</span>
                        <span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500">
                          {employee.fuelExpense.split('·')[1]?.trim() ?? '—'}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{employee.monthlyIncentive}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{employee.giftVoucher}</td>
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

