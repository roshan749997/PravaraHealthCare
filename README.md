# Pravara HealthCare Management Portal 🏥

> **Full-stack clinical and hospital management system built with React 19, Express 5, Recharts, and MongoDB.**

[![React 19](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react)](https://react.dev)
[![Express 5](https://img.shields.io/badge/Express-5.1-black?style=flat&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-green?style=flat&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 📌 Overview

**Pravara HealthCare** is a modern hospital administration and patient management system designed to streamline clinical workflows, patient registrations, appointment scheduling, and departmental analytics.

---

## ✨ Features

- 📊 **Clinical Analytics Dashboard:** Interactive data visualizations powered by `recharts` for tracking patient admissions, consultations, and bed occupancy.
- 🔐 **Role-Based Access Control:** Secure JWT authentication and Bcrypt password encryption separating administrative, doctor, and patient capabilities.
- ⚡ **High-Speed Frontend:** Engineered with React 19, Vite, React Router DOM v7, and Tailwind CSS v4 for zero-latency interactions.
- ☁️ **Cloud Deployment Ready:** Includes declarative `render.yaml` configuration for automated deployments.

---

## 🏗️ Architecture
```
PravaraHealthCare/
├── backend/                  # Express 5 + Mongoose REST API
│   ├── index.js              # Server entrypoint
│   └── package.json
├── frontend/                 # React 19 + Vite + Tailwind CSS client
│   └── package.json
└── render.yaml               # Cloud deployment specification
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
