const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllComplaints,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/complaints', protect, authorize('admin', 'staff'), getAllComplaints);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
