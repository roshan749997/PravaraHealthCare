const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Allowance = require('../models/Allowance');
const Expense = require('../models/Expense');

// Get monthly summary (income vs expenses)
router.get('/monthly-summary', async (req, res) => {
  try {
    const { year = 2025 } = req.query;
    const employees = await Employee.find({ status: 'Active' });
    const baseSalary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);

    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const allowances = await Allowance.find({ month, year: parseInt(year) });
      const expense = await Expense.findOne({ month, year: parseInt(year) });

      const totalIncentive = allowances.reduce((sum, a) => sum + a.incentive, 0);
      const income = (baseSalary + totalIncentive) / 100000; // Convert to Lakhs

      const totalExpense = ((expense?.officeRent || 0) + (expense?.lightBill || 0) + (expense?.other || 0)) / 100000;

      monthlyData.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1],
        income: parseFloat(income.toFixed(1)),
        expense: parseFloat(totalExpense.toFixed(1))
      });
    }

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get metrics
router.get('/metrics', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const allowances = await Allowance.find({ month: currentMonth, year: currentYear });
    const expenses = await Expense.find({ month: currentMonth, year: currentYear });

    const totalSalary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const totalIncentive = allowances.reduce((sum, a) => sum + a.incentive, 0);
    const totalIncome = totalSalary + totalIncentive;

    const totalExpenses = expenses.reduce((sum, e) => sum + e.officeRent + e.lightBill + e.other, 0);
    const netIncome = totalIncome - totalExpenses;

    res.json({
      success: true,
      data: {
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netIncome: parseFloat(netIncome.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get income breakdown
router.get('/income-breakdown', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const allowances = await Allowance.find({ month: currentMonth, year: currentYear });

    const salary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const incentive = allowances.reduce((sum, a) => sum + a.incentive, 0);
    const total = salary + incentive;

    res.json({
      success: true,
      data: [
        { label: 'Salary', value: salary },
        { label: 'Incentive', value: incentive },
        { label: 'Total', value: total }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get expense breakdown
router.get('/expense-breakdown', async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const expenses = await Expense.find({ month: currentMonth, year: currentYear });
    const allowances = await Allowance.find({ month: currentMonth, year: currentYear });

    const officeRent = expenses.reduce((sum, e) => sum + e.officeRent, 0);
    const lightBill = expenses.reduce((sum, e) => sum + e.lightBill, 0);
    const other = expenses.reduce((sum, e) => sum + e.other, 0);
    const petrol = allowances.reduce((sum, a) => sum + (a.petrolDiesel?.amount || 0), 0);
    const recharge = allowances.reduce((sum, a) => sum + a.mobileRecharge, 0);
    const gifts = allowances.reduce((sum, a) => sum + a.gifts, 0);

    const total = officeRent + lightBill + other + petrol + recharge + gifts;

    const breakdown = [
      { name: 'Office Rent', value: Math.round((officeRent / total) * 100), amount: officeRent, color: '#F59E0B' },
      { name: 'Light Bill', value: Math.round((lightBill / total) * 100), amount: lightBill, color: '#DC2626' },
      { name: 'Petrol/Diesel', value: Math.round((petrol / total) * 100), amount: petrol, color: '#84CC16' },
      { name: 'Mobile Recharge', value: Math.round((recharge / total) * 100), amount: recharge, color: '#06B6D4' },
      { name: 'Gifts', value: Math.round((gifts / total) * 100), amount: gifts, color: '#6B7280' },
      { name: 'Other', value: Math.round((other / total) * 100), amount: other, color: '#8B5CF6' }
    ];

    res.json({ success: true, data: breakdown });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



