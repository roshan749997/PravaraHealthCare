# Frontend to Backend API Mapping

## Quick Reference: What Each Page Needs

### 📊 Dashboard (`/`)
**Needs:**
- KPI metrics (conversion rate, revenue, customers)
- Revenue distribution by category
- Monthly sales trends
- Employee distribution by department
- Customer retention data
- Sales funnel metrics

**APIs:**
```
GET /api/dashboard/kpis
GET /api/dashboard/revenue-distribution
GET /api/dashboard/monthly-sales-trend
GET /api/dashboard/employee-distribution
GET /api/dashboard/customer-retention
GET /api/dashboard/sales-funnel
```

---

### 👥 Employee List (`/employees`)
**Needs:**
- Hiring KPIs (hiring rate, days to hire, cost per hire)
- Recruitment funnel data
- Monthly hiring metrics
- Pipeline efficiency stats

**APIs:**
```
GET /api/employees/hiring-kpis
GET /api/employees/recruitment-funnel
GET /api/employees/monthly-metrics
GET /api/employees/pipeline-efficiency
GET /api/employees (list all)
```

---

### 💰 Payroll (`/payroll`)
**Needs:**
- Employee payroll data
- Department salary distribution
- Salary range statistics
- Payroll summary (totals, averages)

**APIs:**
```
GET /api/payroll/summary
GET /api/payroll/employees
GET /api/payroll/department-distribution
GET /api/payroll/salary-ranges
GET /api/payroll/employee/:id
```

---

### 💵 Total Salaries (`/total-salaries`)
**Needs:**
- Complete compensation breakdown per employee
- All allowances (mobile, fuel, incentives, vouchers)
- Department-wise compensation totals
- Compensation breakdown chart data

**APIs:**
```
GET /api/salaries/total-breakdown
GET /api/salaries/employees
GET /api/salaries/compensation-breakdown
GET /api/salaries/department-compensation
GET /api/salaries/employee/:id
```

---

### 📝 Other Expenses (`/other-expenses`)
**Needs:**
- Monthly expenses (rent, utilities, other)
- Expense totals and averages
- Month-wise expense breakdown

**APIs:**
```
GET /api/expenses/summary
GET /api/expenses/monthly
GET /api/expenses/kpis
GET /api/expenses (CRUD)
```

---

### 📈 Financial Analytics (`/financial-analytics`)
**Needs:**
- Monthly income vs expenses
- Income breakdown by source
- Expense breakdown by category
- Financial forecast (8-month projection)
- Net income calculations

**APIs:**
```
GET /api/analytics/monthly-summary
GET /api/analytics/metrics
GET /api/analytics/income-breakdown
GET /api/analytics/expense-breakdown
GET /api/analytics/forecast
GET /api/analytics/alerts
```

---

## Data Flow Diagram

```
Frontend Pages
    ↓
API Requests (Axios/Fetch)
    ↓
Express.js Routes
    ↓
Controllers (Business Logic)
    ↓
MongoDB Models
    ↓
MongoDB Database
```

---

## Common Data Patterns

### Employee Data Structure
```javascript
{
  employeeId: "EMP-001",
  name: "Dr. Kavita Kulkarni",
  department: "Clinical",
  salary: { monthly: 250000, annual: 3000000 },
  allowances: {
    mobileRecharge: 999,
    fuelExpense: 12500,
    monthlyIncentive: 35000,
    giftVoucher: 5000
  }
}
```

### Expense Data Structure
```javascript
{
  month: 1,
  year: 2025,
  officeRent: 220000,
  utilities: 68500,
  other: 45200,
  notes: "Onboarding event, facility maintenance"
}
```

### Revenue Data Structure
```javascript
{
  month: 1,
  year: 2025,
  category: "Consultation",
  amount: 376100,
  growth: 18
}
```

---

## Chart Data Requirements

### Pie Charts Need:
- Array of objects with `name`, `value`, `amount`, `color`

### Bar Charts Need:
- Array of objects with `month`/`name` and value fields

### Line Charts Need:
- Array of objects with time-based fields and multiple series

### Funnel Charts Need:
- Array of stages with conversion percentages

---

## Priority Implementation Order

1. **Employee CRUD** (Foundation)
2. **Expense Management** (Simple, needed early)
3. **Payroll Calculations** (Core business logic)
4. **Dashboard Aggregations** (Complex calculations)
5. **Analytics & Forecasting** (Advanced features)

---

This mapping shows exactly what backend APIs each frontend page requires!



