const Complaint = require('../models/Complaint');
const Department = require('../models/Department');

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, department, priority, location } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({ message: 'Title, description, category, and department are required' });
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(404).json({ message: 'Selected department does not exist' });
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push(`/uploads/${file.filename}`);
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      department,
      priority: priority || 'Medium',
      location: location ? (typeof location === 'string' ? JSON.parse(location) : location) : {},
      filedBy: req.user._id,
      attachments
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('department', 'name code')
      .populate('filedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      data: populatedComplaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'student' || req.user.role === 'faculty') {
      filter.filedBy = req.user._id;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.priority) filter.priority = req.query.priority;

    const complaints = await Complaint.find(filter)
      .populate('department', 'name code')
      .populate('filedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('department', 'name code contactEmail')
      .populate('filedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('timeline.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (
      (req.user.role === 'student' || req.user.role === 'faculty') &&
      complaint.filedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied: You can only view your own complaints' });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const VALID_TRANSITIONS = {
  'Open': ['In Progress'],
  'In Progress': ['Resolved'],
  'Resolved': ['Closed'],
  'Closed': []
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'New status is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const allowed = VALID_TRANSITIONS[complaint.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from "${complaint.status}" to "${status}". Allowed: ${allowed.join(', ') || 'none'}`
      });
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      comment: comment || `Status changed to ${status}`,
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('department', 'name code')
      .populate('filedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('timeline.updatedBy', 'name role');

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: 'assignedTo (staff user ID) is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const User = require('../models/User');
    const staffUser = await User.findById(assignedTo);
    if (!staffUser) {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    complaint.assignedTo = assignedTo;
    complaint.timeline.push({
      status: complaint.status,
      comment: `Assigned to ${staffUser.name}`,
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('department', 'name code')
      .populate('filedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('timeline.updatedBy', 'name role');

    res.status(200).json({
      success: true,
      message: `Complaint assigned to ${staffUser.name}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  deleteComplaint
};
