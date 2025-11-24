const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Employees
  getEmployees: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/employees?${query}`).then(res => res.json());
  },
  getEmployee: (id) => fetch(`${API_BASE}/employees/${id}`).then(res => res.json()),
  createEmployee: (data) => fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateEmployee: (id, data) => fetch(`${API_BASE}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteEmployee: (id) => fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Expenses
  getExpenses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/expenses?${query}`).then(res => res.json());
  },
  getExpenseSummary: () => fetch(`${API_BASE}/expenses/summary`).then(res => res.json()),
  createExpense: (data) => fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateExpense: (id, data) => fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteExpense: (id) => fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Allowances
  getAllowances: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/allowances?${query}`).then(res => res.json());
  },
  getAllowanceSummary: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/allowances/summary?${query}`).then(res => res.json());
  },
  createAllowance: (data) => fetch(`${API_BASE}/allowances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateAllowance: (id, data) => fetch(`${API_BASE}/allowances/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteAllowance: (id) => fetch(`${API_BASE}/allowances/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Payroll
  getPayrolls: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/payroll?${query}`).then(res => res.json());
  },
  getPayrollSummary: () => fetch(`${API_BASE}/payroll/summary`).then(res => res.json()),
  processPayroll: (data) => fetch(`${API_BASE}/payroll/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Dashboard
  getKPIs: () => fetch(`${API_BASE}/dashboard/kpis`).then(res => res.json()),
  getExpenseDistribution: () => fetch(`${API_BASE}/dashboard/expense-distribution`).then(res => res.json()),
  getMonthlyExpenseTrend: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/dashboard/monthly-expense-trend?${query}`).then(res => res.json());
  },
  getEmployeeDistribution: () => fetch(`${API_BASE}/dashboard/employee-distribution`).then(res => res.json()),

  // Analytics
  getMonthlySummary: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/analytics/monthly-summary?${query}`).then(res => res.json());
  },
  getMetrics: () => fetch(`${API_BASE}/analytics/metrics`).then(res => res.json()),
  getIncomeBreakdown: () => fetch(`${API_BASE}/analytics/income-breakdown`).then(res => res.json()),
  getExpenseBreakdown: () => fetch(`${API_BASE}/analytics/expense-breakdown`).then(res => res.json()),

  // Admin
  getAdminDashboard: () => fetch(`${API_BASE}/admin/dashboard`).then(res => res.json()),
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);



