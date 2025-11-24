const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Allowance = require('../models/Allowance');

// Get all payrolls
router.get('/', async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'name employeeId department')
      .sort({ year: -1, month: -1 });
    
    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payroll summary
router.get('/summary', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' });
    const totalMonthly = employees.reduce((sum, e) => sum + e.salary.monthly, 0);
    const totalAnnual = employees.reduce((sum, e) => sum + e.salary.annual, 0);
    const highestMonthly = Math.max(...employees.map(e => e.salary.monthly), 0);
    const averageMonthly = employees.length > 0 ? totalMonthly / employees.length : 0;

    res.json({
      success: true,
      data: {
        monthlyPayroll: totalMonthly,
        annualPayroll: totalAnnual,
        highestMonthlyPay: highestMonthly,
        averageMonthlyPay: Math.round(averageMonthly),
        totalEmployees: employees.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Process payroll for a month
router.post('/process', async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and year are required' });
    }

    const employees = await Employee.find({ status: 'Active' });
    const processedPayrolls = [];

    for (const employee of employees) {
      // Get allowances for this employee and month
      const allowance = await Allowance.findOne({
        employeeId: employee._id,
        month: parseInt(month),
        year: parseInt(year)
      });

      const allowances = {
        mobileRecharge: allowance?.mobileRecharge || 0,
        petrolDiesel: allowance?.petrolDiesel?.amount || 0,
        incentive: allowance?.incentive || 0,
        gifts: allowance?.gifts || 0
      };

      const totalCompensation = employee.salary.monthly + 
        allowances.mobileRecharge + 
        allowances.petrolDiesel + 
        allowances.incentive + 
        allowances.gifts;

      // Create or update payroll
      const payroll = await Payroll.findOneAndUpdate(
        { employeeId: employee._id, month: parseInt(month), year: parseInt(year) },
        {
          salary: employee.salary.monthly,
          allowances,
          totalCompensation,
          status: 'Processed',
          processedDate: new Date()
        },
        { upsert: true, new: true }
      ).populate('employeeId', 'name employeeId department');

      processedPayrolls.push(payroll);
    }

    res.json({
      success: true,
      message: `Payroll processed for ${month}/${year}`,
      data: processedPayrolls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



