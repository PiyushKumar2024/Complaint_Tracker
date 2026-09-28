const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);

module.exports = router;
