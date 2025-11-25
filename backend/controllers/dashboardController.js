const DashboardData = require('../models/Dashboard');
const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');
const Expense = require('../models/Expense');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};

    if (month) query.month = month;
    if (year) query.year = parseInt(year);

    const dashboardData = await DashboardData.find(query)
      .sort({ year: -1, month: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: dashboardData.length,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics/summary
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total employees by department
    const employeeStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$monthlySalary' }
        }
      }
    ]);

    // Get latest payroll summary
    const latestMonth = new Date();
    const monthStr = String(latestMonth.getMonth() + 1).padStart(2, '0');
    const year = latestMonth.getFullYear();
    const currentMonth = `${monthStr}-${year}`;

    const payrollStats = await Payroll.aggregate([
      { $match: { month: currentMonth, year: year } },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: '$baseSalary' },
          totalIncentives: { $sum: '$monthlyIncentive' },
          totalGifts: { $sum: '$giftVoucher' },
          totalExpenses: { $sum: { $add: ['$mobileRecharge', '$fuelExpense'] } }
        }
      }
    ]);

    // Get expense summary for current month
    const expenseStats = await Expense.aggregate([
      { $match: { month: currentMonth, year: year } },
      {
        $group: {
          _id: null,
          totalRent: { $sum: '$officeRent' },
          totalUtilities: { $sum: '$utilities' },
          totalOther: { $sum: '$other' }
        }
      }
    ]);

    // Get total employee count
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });

    res.status(200).json({
      success: true,
      data: {
        employeeStats,
        payrollStats: payrollStats[0] || {
          totalSalary: 0,
          totalIncentives: 0,
          totalGifts: 0,
          totalExpenses: 0
        },
        expenseStats: expenseStats[0] || {
          totalRent: 0,
          totalUtilities: 0,
          totalOther: 0
        },
        totalEmployees
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create/Update dashboard data
// @route   POST /api/dashboard
// @access  Private/Admin
exports.createDashboardData = async (req, res) => {
  try {
    // Extract year from month string (MM-YYYY)
    if (req.body.month) {
      const yearMatch = req.body.month.match(/-(\d{4})$/);
      if (yearMatch) {
        req.body.year = parseInt(yearMatch[1]);
      }
    }

    const dashboardData = await DashboardData.create(req.body);

    res.status(201).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update dashboard data
// @route   PUT /api/dashboard/:id
// @access  Private/Admin
exports.updateDashboardData = async (req, res) => {
  try {
    let dashboardData = await DashboardData.findById(req.params.id);

    if (!dashboardData) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard data not found'
      });
    }

    // Extract year from month string if month is being updated
    if (req.body.month) {
      const yearMatch = req.body.month.match(/-(\d{4})$/);
      if (yearMatch) {
        req.body.year = parseInt(yearMatch[1]);
      }
    }

    dashboardData = await DashboardData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete dashboard data
// @route   DELETE /api/dashboard/:id
// @access  Private/Admin
exports.deleteDashboardData = async (req, res) => {
  try {
    const dashboardData = await DashboardData.findById(req.params.id);

    if (!dashboardData) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard data not found'
      });
    }

    await dashboardData.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Dashboard data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

