# Setup Instructions - Pravara Health Clinic Management System

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with your MongoDB Atlas connection string.

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Install axios for API calls:
```bash
npm install axios
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar Vite port)

## Access Points

- **Frontend Dashboard:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Backend API:** http://localhost:5000/api

## Admin Panel Features

1. **Manage Employees** (`/admin/employees`)
   - Add new employees
   - Edit employee details
   - Update salaries
   - Deactivate employees

2. **Manage Expenses** (`/admin/expenses`)
   - Add monthly expenses
   - Office Rent
   - Light Bill
   - Other Expenses

3. **Manage Allowances** (`/admin/allowances`)
   - Mobile Recharge
   - Petrol/Diesel expenses
   - Incentives
   - Gifts

4. **Process Payroll** (`/admin/payroll`)
   - Generate monthly payroll
   - View payroll history
   - Process payments

## First Time Setup

1. Start both backend and frontend servers
2. Go to Admin Panel: http://localhost:5173/admin
3. Add some employees
4. Add expenses for current month
5. Add allowances for employees
6. Process payroll
7. View data in Dashboard and other pages

## Database Collections

- **employees** - Employee information
- **expenses** - Monthly office expenses
- **allowances** - Employee allowances
- **payrolls** - Processed payroll records

All data is stored in MongoDB Atlas cloud database.



