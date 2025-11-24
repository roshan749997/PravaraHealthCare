# Quick Start Guide

## 🚀 Getting Started

### Step 1: Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

### Step 3: Access the Application

1. **Main Dashboard:** http://localhost:5173
2. **Admin Panel:** http://localhost:5173/admin

## 📝 First Steps in Admin Panel

1. Go to **Admin Panel** → **Manage Employees**
2. Add your first employee with:
   - Employee ID (e.g., EMP-001)
   - Name, Department, Salary
3. Go to **Manage Expenses**
   - Add monthly expenses (Office Rent, Light Bill, Other)
4. Go to **Manage Allowances**
   - Add allowances for employees (Mobile, Petrol, Incentive, Gifts)
5. Go to **Process Payroll**
   - Process payroll for the current month
6. View data in **Dashboard** and other pages

## ✅ All Features Working

- ✅ Employee Management (CRUD)
- ✅ Expense Management (Office Rent, Light Bill, Other)
- ✅ Allowance Management (Mobile, Petrol, Incentive, Gifts)
- ✅ Payroll Processing
- ✅ Dashboard with real-time data
- ✅ Analytics and Reports
- ✅ All charts connected to backend

## 🔧 Troubleshooting

If backend doesn't connect:
1. Check MongoDB Atlas connection string in `backend/.env`
2. Ensure MongoDB Atlas allows your IP address
3. Check backend server is running on port 5000

If frontend shows errors:
1. Ensure backend is running first
2. Check browser console for API errors
3. Verify CORS is enabled in backend

## 📊 Database Collections

All data is stored in MongoDB Atlas:
- `employees` - Employee records
- `expenses` - Monthly expenses
- `allowances` - Employee allowances
- `payrolls` - Processed payroll records

Everything is ready to use! 🎉



