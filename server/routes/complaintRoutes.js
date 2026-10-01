const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('attachments', 3), createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateComplaintStatus);
router.patch('/:id/assign', protect, authorize('admin'), assignComplaint);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

module.exports = router;
