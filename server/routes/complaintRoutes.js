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
const {
  validateComplaint,
  validateStatusUpdate,
  validateAssign,
  validateObjectIdParam
} = require('../middleware/validators');

router.post('/', protect, upload.array('attachments', 3), validateComplaint, createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, validateObjectIdParam, getComplaintById);
router.patch('/:id/status', protect, validateObjectIdParam, authorize('staff', 'admin'), validateStatusUpdate, updateComplaintStatus);
router.patch('/:id/assign', protect, validateObjectIdParam, authorize('admin'), validateAssign, assignComplaint);
router.delete('/:id', protect, validateObjectIdParam, authorize('admin'), deleteComplaint);

module.exports = router;
