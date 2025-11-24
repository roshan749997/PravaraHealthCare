# Backend API Server

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (already created with MongoDB URI)

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Allowances
- `GET /api/allowances` - Get all allowances
- `POST /api/allowances` - Create allowance
- `PUT /api/allowances/:id` - Update allowance
- `DELETE /api/allowances/:id` - Delete allowance

### Payroll
- `GET /api/payroll` - Get all payrolls
- `POST /api/payroll/process` - Process payroll

### Dashboard
- `GET /api/dashboard/kpis` - Get KPI metrics
- `GET /api/dashboard/expense-distribution` - Get expense distribution
- `GET /api/dashboard/monthly-expense-trend` - Get monthly trend
- `GET /api/dashboard/employee-distribution` - Get employee distribution

### Analytics
- `GET /api/analytics/monthly-summary` - Get monthly summary
- `GET /api/analytics/metrics` - Get metrics
- `GET /api/analytics/income-breakdown` - Get income breakdown
- `GET /api/analytics/expense-breakdown` - Get expense breakdown



