const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Allowance = require('../models/Allowance');
const Payroll = require('../models/Payroll');

// Get user profile by employee ID
router.get('/profile/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user allowances
router.get('/allowances/:employeeId', async (req, res) => {
  try {
    const { month, year } = req.query;
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const query = { employeeId: employee._id };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const allowances = await Allowance.find(query)
      .sort({ year: -1, month: -1 })
      .limit(12);

    res.json({ success: true, data: allowances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user payroll history
router.get('/payroll/:employeeId', async (req, res) => {
  try {
    const { month, year } = req.query;
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const query = { employeeId: employee._id };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await Payroll.find(query)
      .sort({ year: -1, month: -1 })
      .limit(12);

    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get list of all employee IDs (for user search)
router.get('/employees/list', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' })
      .select('employeeId name department')
      .sort({ employeeId: 1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user dashboard summary
router.get('/dashboard/:employeeId', async (req, res) => {
  try {
    // Try case-insensitive search
    const employee = await Employee.findOne({ 
      employeeId: { $regex: new RegExp(`^${req.params.employeeId}$`, 'i') }
    });
    if (!employee) {
      // Get list of available employee IDs for better error message
      const availableEmployees = await Employee.find({ status: 'Active' })
        .select('employeeId name')
        .limit(10)
        .sort({ employeeId: 1 });
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found',
        availableEmployees: availableEmployees.map(e => ({ id: e.employeeId, name: e.name }))
      });
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get current month allowances
    const currentAllowance = await Allowance.findOne({
      employeeId: employee._id,
      month: currentMonth,
      year: currentYear
    });

    // Get current month payroll
    const currentPayroll = await Payroll.findOne({
      employeeId: employee._id,
      month: currentMonth,
      year: currentYear
    });

    // Get last 6 months allowances
    const allowancesHistory = await Allowance.find({
      employeeId: employee._id
    })
      .sort({ year: -1, month: -1 })
      .limit(6);

    // Get last 6 months payroll
    const payrollHistory = await Payroll.find({
      employeeId: employee._id
    })
      .sort({ year: -1, month: -1 })
      .limit(6);

    const totalAllowances = currentAllowance ? 
      (currentAllowance.mobileRecharge || 0) + 
      (currentAllowance.petrolDiesel?.amount || 0) + 
      (currentAllowance.incentive || 0) + 
      (currentAllowance.gifts || 0) : 0;

    res.json({
      success: true,
      data: {
        employee,
        currentMonth: {
          salary: employee.salary.monthly,
          allowances: totalAllowances,
          totalCompensation: employee.salary.monthly + totalAllowances,
          allowance: currentAllowance,
          payroll: currentPayroll
        },
        history: {
          allowances: allowancesHistory,
          payrolls: payrollHistory
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

