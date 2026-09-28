const Department = require('../models/Department');

// @desc    Get all departments with their categories
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching departments'
    });
  }
};

// @desc    Get single department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching department'
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById
};
