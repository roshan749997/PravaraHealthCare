# Pravara Health Clinic - Backend API

Complete backend API for Pravara Health Clinic management system with Admin and Employee panels.

## 🚀 Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://Roshan:Roshan%40123@cluster0.lfxbvrg.mongodb.net/PravaraHealthClinic

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Copy the MongoDB URI exactly as provided above
- Change `JWT_SECRET` to a strong random string in production
- Update `FRONTEND_URL` if your frontend runs on a different port

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### 4. Create Admin User

After starting the server, use the register endpoint to create an admin user:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@pravara.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Using Postman or any API client:**
- Method: POST
- URL: `http://localhost:5000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "username": "admin",
  "email": "admin@pravara.com",
  "password": "admin123",
  "role": "admin"
}
```

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user (admin or employee)
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)

### Employees (`/api/employees`)
- `GET /` - Get all employees (admin: all, employee: own)
- `GET /:id` - Get single employee
- `POST /` - Create employee (admin only)
- `PUT /:id` - Update employee (admin only)
- `DELETE /:id` - Delete employee (admin only)

### Payroll (`/api/payroll`)
- `GET /` - Get all payroll records (admin: all, employee: own)
- `GET /:id` - Get single payroll record
- `GET /stats/summary` - Get payroll statistics (admin only)
- `POST /` - Create payroll record (admin only)
- `PUT /:id` - Update payroll record (admin only)
- `DELETE /:id` - Delete payroll record (admin only)

### Expenses (`/api/expenses`)
- `GET /` - Get all expenses (admin only)
- `GET /:id` - Get single expense (admin only)
- `GET /stats/summary` - Get expense statistics (admin only)
- `POST /` - Create expense (admin only)
- `PUT /:id` - Update expense (admin only)
- `DELETE /:id` - Delete expense (admin only)

### Dashboard (`/api/dashboard`)
- `GET /` - Get dashboard data
- `GET /stats` - Get dashboard statistics
- `POST /` - Create dashboard data (admin only)
- `PUT /:id` - Update dashboard data (admin only)
- `DELETE /:id` - Delete dashboard data (admin only)

### Admin (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `PUT /users/:id` - Update user (admin only)
- `DELETE /users/:id` - Delete user (admin only)
- `GET /stats` - Get system statistics (admin only)
- `GET /overview` - Get admin overview (admin only)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 👥 User Roles

- **admin**: Full access to all features, can manage everything
- **employee**: Limited access, can only view own data

## 📝 Example API Calls

### Login
```javascript
POST /api/auth/login
{
  "email": "admin@pravara.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@pravara.com",
    "role": "admin"
  }
}
```

### Get Employees (with token)
```javascript
GET /api/employees
Headers: {
  "Authorization": "Bearer <token>"
}
```

## 🗄️ Database Models

### User
- Authentication and authorization
- Links to Employee for employee role users

### Employee
- Employee information
- Department, designation, salary details

### Payroll
- Monthly payroll records
- Links to Employee
- Includes salary, incentives, allowances, etc.

### Expense
- Monthly office expenses
- Office rent, utilities, other expenses

### DashboardData
- Dashboard statistics and metrics
- Revenue, sales, employee distribution data

## 🛠️ Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📦 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin resource sharing
- dotenv - Environment variables

## 🐛 Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## ✅ Health Check

Check if server is running:
```
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-XX..."
}
```

## 🔒 Security Notes

1. Always use HTTPS in production
2. Change JWT_SECRET to a strong random string
3. Implement rate limiting in production
4. Validate and sanitize all inputs
5. Use environment variables for sensitive data

