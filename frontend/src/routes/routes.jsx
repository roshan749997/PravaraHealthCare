import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import EmployeeList from '../pages/EmployeeList.jsx'
import Payroll from '../pages/Payroll.jsx'
import TotalSalaries from '../pages/TotalSalaries.jsx'
import OtherExpenses from '../pages/OtherExpenses.jsx'
import FinancialAnalytics from '../pages/FinancialAnalytics.jsx'
import AdminPanel from '../pages/AdminPanel.jsx'
import ManageEmployees from '../pages/admin/ManageEmployees.jsx'
import ManageExpenses from '../pages/admin/ManageExpenses.jsx'
import ManageAllowances from '../pages/admin/ManageAllowances.jsx'
import ProcessPayroll from '../pages/admin/ProcessPayroll.jsx'
import Reports from '../pages/admin/Reports.jsx'
import Settings from '../pages/admin/Settings.jsx'
import UserPanel from '../pages/UserPanel.jsx'
import Login from '../pages/Login.jsx'
import Layout from '../components/Layout.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import EmployeeRouteGuard from '../components/EmployeeRouteGuard.jsx'

export function createAppRouter() {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Public Dashboard Routes - Hidden from employees, only for admins or non-logged-in users */}
          <Route 
            path="/" 
            element={
              <EmployeeRouteGuard>
                <Dashboard />
              </EmployeeRouteGuard>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <EmployeeRouteGuard>
                <EmployeeList />
              </EmployeeRouteGuard>
            } 
          />
          <Route 
            path="/payroll" 
            element={
              <EmployeeRouteGuard>
                <Payroll />
              </EmployeeRouteGuard>
            } 
          />
          <Route 
            path="/total-salaries" 
            element={
              <EmployeeRouteGuard>
                <TotalSalaries />
              </EmployeeRouteGuard>
            } 
          />
          <Route 
            path="/financial-analytics" 
            element={
              <EmployeeRouteGuard>
                <FinancialAnalytics />
              </EmployeeRouteGuard>
            } 
          />
          <Route 
            path="/other-expenses" 
            element={
              <EmployeeRouteGuard>
                <OtherExpenses />
              </EmployeeRouteGuard>
            } 
          />
          
          {/* Protected User Route - Only shows logged-in employee's own data */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/employees" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageEmployees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/expenses" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageExpenses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/allowances" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageAllowances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payroll" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ProcessPayroll />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Route>
      </>
    ),
  )
}

export const router = createAppRouter()

