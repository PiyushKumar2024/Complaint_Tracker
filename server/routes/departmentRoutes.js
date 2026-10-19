const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById
} = require('../controllers/departmentController');
const { validateObjectIdParam } = require('../middleware/validators');

router.get('/', getAllDepartments);
router.get('/:id', validateObjectIdParam, getDepartmentById);

module.exports = router;
