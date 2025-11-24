const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Expense = require('../models/Expense');
const Allowance = require('../models/Allowance');
const Payroll = require('../models/Payroll');

// Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const expenses = await Expense.find({ month: currentMonth, year: currentYear });
    const allowances = await Allowance.find({ month: currentMonth, year: currentYear });
    const payrolls = await Payroll.find({ month: currentMonth, year: currentYear });

    const totalSalary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.officeRent + e.lightBill + e.other, 0);
    const totalAllowances = allowances.reduce((sum, a) => 
      sum + a.mobileRecharge + (a.petrolDiesel?.amount || 0) + a.incentive + a.gifts, 0);

    res.json({
      success: true,
      data: {
        totalEmployees: employees.length,
        totalSalary,
        totalExpenses,
        totalAllowances,
        processedPayrolls: payrolls.filter(p => p.status === 'Processed').length,
        pendingPayrolls: payrolls.filter(p => p.status === 'Pending').length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk operations
router.post('/employees/bulk', async (req, res) => {
  try {
    const { employees } = req.body;
    const created = await Employee.insertMany(employees, { ordered: false });
    res.json({ success: true, data: created, count: created.length });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Export all data
router.get('/export/all', async (req, res) => {
  try {
    const { type, month, year } = req.query;
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();

    let data = {};
    
    if (!type || type === 'employees') {
      data.employees = await Employee.find({});
    }
    if (!type || type === 'expenses') {
      data.expenses = await Expense.find({ month: parseInt(currentMonth), year: parseInt(currentYear) });
    }
    if (!type || type === 'allowances') {
      data.allowances = await Allowance.find({ month: parseInt(currentMonth), year: parseInt(currentYear) }).populate('employeeId');
    }
    if (!type || type === 'payroll') {
      data.payrolls = await Payroll.find({ month: parseInt(currentMonth), year: parseInt(currentYear) }).populate('employeeId');
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Advanced analytics
router.get('/analytics/overview', async (req, res) => {
  try {
    const { startMonth, startYear, endMonth, endYear } = req.query;
    const currentDate = new Date();
    const startM = parseInt(startMonth) || 1;
    const startY = parseInt(startYear) || currentDate.getFullYear();
    const endM = parseInt(endMonth) || 12;
    const endY = parseInt(endYear) || currentDate.getFullYear();

    const employees = await Employee.find({ status: 'Active' });
    const expenses = await Expense.find({
      $or: [
        { year: { $gt: startY } },
        { year: startY, month: { $gte: startM } },
        { year: endY, month: { $lte: endM } }
      ]
    });
    const allowances = await Allowance.find({
      $or: [
        { year: { $gt: startY } },
        { year: startY, month: { $gte: startM } },
        { year: endY, month: { $lte: endM } }
      ]
    }).populate('employeeId');

    const totalSalary = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.officeRent + e.lightBill + e.other, 0);
    const totalAllowances = allowances.reduce((sum, a) => 
      sum + a.mobileRecharge + (a.petrolDiesel?.amount || 0) + a.incentive + a.gifts, 0);

    // Department-wise breakdown
    const deptBreakdown = {};
    employees.forEach(emp => {
      if (!deptBreakdown[emp.department]) {
        deptBreakdown[emp.department] = { count: 0, totalSalary: 0 };
      }
      deptBreakdown[emp.department].count++;
      deptBreakdown[emp.department].totalSalary += emp.salary.monthly;
    });

    res.json({
      success: true,
      data: {
        totalEmployees: employees.length,
        totalSalary,
        totalExpenses,
        totalAllowances,
        totalCost: totalSalary + totalExpenses + totalAllowances,
        departmentBreakdown: deptBreakdown,
        monthlyTrends: {
          expenses: expenses.map(e => ({ month: e.month, year: e.year, total: e.officeRent + e.lightBill + e.other })),
          allowances: allowances.map(a => ({ month: a.month, year: a.year, total: a.mobileRecharge + (a.petrolDiesel?.amount || 0) + a.incentive + a.gifts }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



