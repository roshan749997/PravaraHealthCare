const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Allowance = require('../models/Allowance');
const Expense = require('../models/Expense');
const Payroll = require('../models/Payroll');

// Get KPI metrics
router.get('/kpis', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get current month data
    const allowances = await Allowance.find({ month: currentMonth, year: currentYear });
    const expenses = await Expense.findOne({ month: currentMonth, year: currentYear });

    const totalSalary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const totalIncentives = allowances.reduce((sum, a) => sum + a.incentive, 0);
    const totalGifts = allowances.reduce((sum, a) => sum + a.gifts, 0);
    const totalExpenses = (expenses?.officeRent || 0) + (expenses?.lightBill || 0) + (expenses?.other || 0);

    res.json({
      success: true,
      data: {
        totalSalaryPayout: totalSalary,
        totalIncentives,
        totalGifts,
        totalExpenses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get expense distribution
router.get('/expense-distribution', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const allowances = await Allowance.find({ month: currentMonth, year: currentYear });
    const expense = await Expense.findOne({ month: currentMonth, year: currentYear });

    const totalSalary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const totalIncentive = allowances.reduce((sum, a) => sum + a.incentive, 0);
    const totalPetrol = allowances.reduce((sum, a) => sum + (a.petrolDiesel?.amount || 0), 0);
    const totalRecharge = allowances.reduce((sum, a) => sum + a.mobileRecharge, 0);
    const totalGifts = allowances.reduce((sum, a) => sum + a.gifts, 0);
    const officeRent = expense?.officeRent || 0;
    const lightBill = expense?.lightBill || 0;

    const total = totalSalary + totalIncentive + officeRent + totalPetrol + totalRecharge + lightBill + totalGifts;

    const distribution = [
      { name: 'Salary', value: Math.round((totalSalary / total) * 100), amount: totalSalary, color: '#8B5CF6' },
      { name: 'Incentive', value: Math.round((totalIncentive / total) * 100), amount: totalIncentive, color: '#EC4899' },
      { name: 'Office Rent', value: Math.round((officeRent / total) * 100), amount: officeRent, color: '#10B981' },
      { name: 'Petrol/Diesel', value: Math.round((totalPetrol / total) * 100), amount: totalPetrol, color: '#F59E0B' },
      { name: 'Mobile Recharge', value: Math.round((totalRecharge / total) * 100), amount: totalRecharge, color: '#6366F1' },
      { name: 'Light Bill', value: Math.round((lightBill / total) * 100), amount: lightBill, color: '#06B6D4' },
      { name: 'Gifts', value: Math.round((totalGifts / total) * 100), amount: totalGifts, color: '#84CC16' }
    ];

    res.json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get monthly expense trend
router.get('/monthly-expense-trend', async (req, res) => {
  try {
    const { startMonth = 1, endMonth = 6, year = 2025 } = req.query;
    const expenses = await Expense.find({
      month: { $gte: parseInt(startMonth), $lte: parseInt(endMonth) },
      year: parseInt(year)
    }).sort({ month: 1 });

    const trend = expenses.map(e => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][e.month - 1],
      totalExpenses: ((e.officeRent + e.lightBill + e.other) / 100000).toFixed(2)
    }));

    res.json({ success: true, data: trend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get employee distribution
router.get('/employee-distribution', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const deptStats = {};

    employees.forEach(emp => {
      if (!deptStats[emp.department]) {
        deptStats[emp.department] = { count: 0, totalSalary: 0 };
      }
      deptStats[emp.department].count++;
      deptStats[emp.department].totalSalary += emp.salary.monthly;
    });

    const total = employees.length;
    const distribution = Object.keys(deptStats).map((dept, idx) => ({
      name: dept,
      value: Math.round((deptStats[dept].count / total) * 100),
      employees: deptStats[dept].count,
      avgSalary: Math.round(deptStats[dept].totalSalary / deptStats[dept].count),
      color: ['#F59E0B', '#DC2626', '#84CC16', '#06B6D4', '#6B7280'][idx % 5]
    }));

    res.json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



