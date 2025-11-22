import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import EmployeeList from '../pages/EmployeeList.jsx'
import Payroll from '../pages/Payroll.jsx'
import TotalSalaries from '../pages/TotalSalaries.jsx'
import OtherExpenses from '../pages/OtherExpenses.jsx'
import FinancialAnalytics from '../pages/FinancialAnalytics.jsx'
import Layout from '../components/Layout.jsx'

export function createAppRouter() {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/total-salaries" element={<TotalSalaries />} />
        <Route path="/financial-analytics" element={<FinancialAnalytics />} />
        <Route path="/other-expenses" element={<OtherExpenses />} />
      </Route>
    ),
  )
}

export const router = createAppRouter()

