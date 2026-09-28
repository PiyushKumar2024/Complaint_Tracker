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

    const complaint = await Complaint.create({
      title,
      description,
      category,
      department,
      priority: priority || 'Medium',
      location: location || {},
      filedBy: req.user._id
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

    if (req.user.role === 'student') {
      filter.filedBy = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.department) {
      filter.department = req.query.department;
    }

    const complaints = await Complaint.find(filter)
      .populate('department', 'name code')
      .populate('filedBy', 'name email')
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

    if (req.user.role === 'student' && complaint.filedBy._id.toString() !== req.user._id.toString()) {
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

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById
};
