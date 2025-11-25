const express = require('express');
const {
  getPayrolls,
  getPayroll,
  createPayroll,
  updatePayroll,
  deletePayroll,
  getPayrollSummary
} = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats/summary', protect, authorize('admin'), getPayrollSummary);

router.route('/')
  .get(protect, getPayrolls)
  .post(protect, authorize('admin'), createPayroll);

router.route('/:id')
  .get(protect, getPayroll)
  .put(protect, authorize('admin'), updatePayroll)
  .delete(protect, authorize('admin'), deletePayroll);

module.exports = router;

