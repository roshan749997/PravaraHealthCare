const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
exports.getExpenses = async (req, res) => {
  try {
    let query = {};

    // Filter by month/year if provided
    if (req.query.month) query.month = req.query.month;
    if (req.query.year) query.year = parseInt(req.query.year);

    const expenses = await Expense.find(query)
      .populate('createdBy', 'username email')
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private/Admin
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private/Admin
exports.createExpense = async (req, res) => {
  try {
    // Extract year from month string (MM-YYYY)
    if (req.body.month) {
      const yearMatch = req.body.month.match(/-(\d{4})$/);
      if (yearMatch) {
        req.body.year = parseInt(yearMatch[1]);
      }
    }

    req.body.createdBy = req.user.id;

    const expense = await Expense.create(req.body);

    const populatedExpense = await Expense.findById(expense._id)
      .populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      data: populatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Extract year from month string if month is being updated
    if (req.body.month) {
      const yearMatch = req.body.month.match(/-(\d{4})$/);
      if (yearMatch) {
        req.body.year = parseInt(yearMatch[1]);
      }
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'username email');

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats/summary
// @access  Private/Admin
exports.getExpenseSummary = async (req, res) => {
  try {
    const matchQuery = {};
    if (req.query.year) matchQuery.year = parseInt(req.query.year);

    const stats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOfficeRent: { $sum: '$officeRent' },
          totalUtilities: { $sum: '$utilities' },
          totalOther: { $sum: '$other' },
          totalExpenses: { $sum: { $add: ['$officeRent', '$utilities', '$other'] } },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalOfficeRent: 0,
        totalUtilities: 0,
        totalOther: 0,
        totalExpenses: 0,
        count: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

