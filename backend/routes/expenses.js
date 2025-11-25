const express = require('express');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats/summary', protect, authorize('admin'), getExpenseSummary);

router.route('/')
  .get(protect, authorize('admin'), getExpenses)
  .post(protect, authorize('admin'), createExpense);

router.route('/:id')
  .get(protect, authorize('admin'), getExpense)
  .put(protect, authorize('admin'), updateExpense)
  .delete(protect, authorize('admin'), deleteExpense);

module.exports = router;

