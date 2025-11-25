const express = require('express');
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getSystemStats,
  getAdminOverview
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getSystemStats);
router.get('/overview', getAdminOverview);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;

