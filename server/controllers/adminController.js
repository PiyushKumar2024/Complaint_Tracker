const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');

const getStats = async (req, res) => {
  try {
    const [totalComplaints, openCount, inProgressCount, resolvedCount, closedCount, totalUsers, totalDepartments] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Open' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Closed' }),
      User.countDocuments(),
      Department.countDocuments()
    ]);

    const recentComplaints = await Complaint.find()
      .populate('department', 'name code')
      .populate('filedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const departmentWise = await Complaint.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department'
        }
      },
      { $unwind: '$department' },
      {
        $project: {
          _id: 0,
          department: '$department.name',
          code: '$department.code',
          total: '$count',
          open: 1,
          inProgress: 1,
          resolved: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          open: openCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          closed: closedCount,
          totalUsers,
          totalDepartments
        },
        departmentWise,
        recentComplaints
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.priority) filter.priority = req.query.priority;

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate('department', 'name code')
      .populate('filedBy', 'name email role')
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

const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'faculty', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required (student, faculty, staff, admin)' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getAllComplaints,
  getAllUsers,
  updateUserRole
};
