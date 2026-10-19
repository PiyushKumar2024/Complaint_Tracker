const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllComplaints,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectIdParam } = require('../middleware/validators');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/complaints', protect, authorize('admin', 'staff'), getAllComplaints);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/role', protect, validateObjectIdParam, authorize('admin'), updateUserRole);

module.exports = router;
