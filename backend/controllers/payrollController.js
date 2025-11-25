const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private
exports.getPayrolls = async (req, res) => {
  try {
    let query = {};

    // If employee, only show their own payroll
    if (req.user.role === 'employee' && req.user.employeeId) {
      query.employee = req.user.employeeId;
    }

    // Filter by month/year if provided
    if (req.query.month) query.month = req.query.month;
    if (req.query.year) query.year = parseInt(req.query.year);

    const payrolls = await Payroll.find(query)
      .populate('employee', 'employeeId name email department')
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single payroll record
// @route   GET /api/payroll/:id
// @access  Private
exports.getPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'employeeId name email department');

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found'
      });
    }

    // If employee, only allow viewing own payroll
    if (req.user.role === 'employee' && 
        req.user.employeeId?.toString() !== payroll.employee._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payroll'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create payroll record
// @route   POST /api/payroll
// @access  Private/Admin
exports.createPayroll = async (req, res) => {
  try {
    // Verify employee exists
    const employee = await Employee.findById(req.body.employee);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Set base salary from employee if not provided
    if (!req.body.baseSalary) {
      req.body.baseSalary = employee.monthlySalary;
    }

    // Extract year from month string (MM-YYYY)
    if (req.body.month) {
      const yearMatch = req.body.month.match(/-(\d{4})$/);
      if (yearMatch) {
        req.body.year = parseInt(yearMatch[1]);
      }
    }

    const payroll = await Payroll.create(req.body);

    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate('employee', 'employeeId name email department');

    res.status(201).json({
      success: true,
      data: populatedPayroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payroll record
// @route   PUT /api/payroll/:id
// @access  Private/Admin
exports.updatePayroll = async (req, res) => {
  try {
    let payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found'
      });
    }

    // Extract year from month string if month is being updated
    if (req.body.month) {
      const yearMatch = req.body.month.match(/-(\d{4})$/);
      if (yearMatch) {
        req.body.year = parseInt(yearMatch[1]);
      }
    }

    payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('employee', 'employeeId name email department');

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete payroll record
// @route   DELETE /api/payroll/:id
// @access  Private/Admin
exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found'
      });
    }

    await payroll.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Payroll deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payroll summary/statistics
// @route   GET /api/payroll/stats/summary
// @access  Private/Admin
exports.getPayrollSummary = async (req, res) => {
  try {
    const matchQuery = {};
    if (req.query.month) matchQuery.month = req.query.month;
    if (req.query.year) matchQuery.year = parseInt(req.query.year);

    const stats = await Payroll.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalMonthlySalary: { $sum: '$baseSalary' },
          totalIncentives: { $sum: '$monthlyIncentive' },
          totalRecharge: { $sum: '$mobileRecharge' },
          totalFuel: { $sum: '$fuelExpense' },
          totalVouchers: { $sum: '$giftVoucher' },
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const employeeCount = await Employee.countDocuments({ status: 'Active' });

    res.status(200).json({
      success: true,
      data: {
        ...(stats[0] || {
          totalMonthlySalary: 0,
          totalIncentives: 0,
          totalRecharge: 0,
          totalFuel: 0,
          totalVouchers: 0,
          totalAmount: 0,
          count: 0
        }),
        employeeCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

