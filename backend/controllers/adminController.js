const User = require('../models/User');
const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');
const Expense = require('../models/Expense');
const DashboardData = require('../models/Dashboard');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('employeeId', 'employeeId name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['role', 'employeeId', 'email', 'username'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        user[update] = req.body[update];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('employeeId', 'employeeId name email department');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get system statistics (Admin dashboard)
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      totalUsers,
      totalPayrolls,
      totalExpenses,
      totalDashboardRecords
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'Active' }),
      User.countDocuments(),
      Payroll.countDocuments(),
      Expense.countDocuments(),
      DashboardData.countDocuments()
    ]);

    // Get monthly payroll total
    const latestMonth = new Date();
    const monthStr = String(latestMonth.getMonth() + 1).padStart(2, '0');
    const year = latestMonth.getFullYear();
    const currentMonth = `${monthStr}-${year}`;

    const monthlyPayrollTotal = await Payroll.aggregate([
      { $match: { month: currentMonth, year: year } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyExpenseTotal = await Expense.aggregate([
      { $match: { month: currentMonth, year: year } },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ['$officeRent', '$utilities', '$other'] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        employees: {
          total: totalEmployees,
          active: activeEmployees,
          inactive: totalEmployees - activeEmployees
        },
        users: {
          total: totalUsers
        },
        records: {
          payrolls: totalPayrolls,
          expenses: totalExpenses,
          dashboard: totalDashboardRecords
        },
        currentMonth: {
          payrollTotal: monthlyPayrollTotal[0]?.total || 0,
          expenseTotal: monthlyExpenseTotal[0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all data for admin panel
// @route   GET /api/admin/overview
// @access  Private/Admin
exports.getAdminOverview = async (req, res) => {
  try {
    const [
      employees,
      users,
      recentPayrolls,
      recentExpenses,
      dashboardData
    ] = await Promise.all([
      Employee.find().sort({ createdAt: -1 }).limit(10),
      User.find().select('-password').populate('employeeId').sort({ createdAt: -1 }).limit(10),
      Payroll.find().populate('employee').sort({ createdAt: -1 }).limit(10),
      Expense.find().populate('createdBy').sort({ createdAt: -1 }).limit(10),
      DashboardData.find().sort({ createdAt: -1 }).limit(6)
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentEmployees: employees,
        recentUsers: users,
        recentPayrolls,
        recentExpenses,
        dashboardData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

