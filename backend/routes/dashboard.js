const express = require('express');
const {
  getDashboardData,
  getDashboardStats,
  createDashboardData,
  updateDashboardData,
  deleteDashboardData
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);

router.route('/')
  .get(protect, getDashboardData)
  .post(protect, authorize('admin'), createDashboardData);

router.route('/:id')
  .put(protect, authorize('admin'), updateDashboardData)
  .delete(protect, authorize('admin'), deleteDashboardData);

module.exports = router;

