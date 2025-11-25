# Quick Setup Guide

## Step 1: Create .env File

In the `backend` folder, create a file named `.env` (without any extension) and add:

```env
MONGODB_URI=mongodb+srv://Roshan:Roshan%40123@cluster0.lfxbvrg.mongodb.net/PravaraHealthClinic
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Copy this entire block into your .env file!**

## Step 2: Install & Run

```bash
cd backend
npm install
npm run dev
```

## Step 3: Create Admin User

Open Postman or any API client and create an admin user:

**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@pravara.com",
  "password": "admin123",
  "role": "admin"
}
```

## Step 4: Login

**POST** `http://localhost:5000/api/auth/login`

**Body (JSON):**
```json
{
  "email": "admin@pravara.com",
  "password": "admin123"
}
```

Copy the `token` from the response - you'll need it for protected routes!

## Step 5: Test API

**GET** `http://localhost:5000/api/health`

Should return: `{"success": true, "message": "Server is running"}`

## ✅ Done!

Your backend is ready. The server will run on `http://localhost:5000`

