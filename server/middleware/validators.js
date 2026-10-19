const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    return res.status(400).json({
      message: errors[0].message,
      errors
    });
  }

  next();
};

const validateRegister = [
  body('name')
    .exists().withMessage('Name is required')
    .bail()
    .isString().withMessage('Name must be a string')
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .exists().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional({ values: 'falsy' })
    .isString().withMessage('Phone must be a string')
    .bail()
    .trim()
    .isLength({ max: 25 }).withMessage('Phone must be at most 25 characters'),
  body('password')
    .exists().withMessage('Password is required')
    .bail()
    .isString().withMessage('Password must be a string')
    .bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').customSanitizer(() => undefined),
  body('department')
    .optional()
    .isString().withMessage('Department must be a string')
    .bail()
    .trim()
    .isLength({ max: 100 }).withMessage('Department must be at most 100 characters'),
  validate
];

const validateLogin = [
  body('email')
    .exists().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('Password is required')
    .bail()
    .isString().withMessage('Password must be a string')
    .bail()
    .notEmpty().withMessage('Password is required'),
  validate
];

const validateComplaint = [
  body('title')
    .exists().withMessage('Title is required')
    .bail()
    .isString().withMessage('Title must be a string')
    .bail()
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .exists().withMessage('Description is required')
    .bail()
    .isString().withMessage('Description must be a string')
    .bail()
    .trim()
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .exists().withMessage('Category is required')
    .bail()
    .isString().withMessage('Category must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('department')
    .exists().withMessage('Department is required')
    .bail()
    .isMongoId().withMessage('Department must be a valid ID'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Priority must be Low, Medium, High, or Urgent'),
  body('location.address')
    .optional()
    .isString().withMessage('Address must be a string'),
  body('location.city')
    .optional()
    .isString().withMessage('City must be a string'),
  body('location.pincode')
    .optional()
    .isString().withMessage('Pincode must be a string')
    .bail()
    .matches(/^\d{6}$/).withMessage('Pincode must be exactly 6 digits'),
  validate
];

const validateStatusUpdate = [
  body('status')
    .exists().withMessage('Status is required')
    .bail()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed']).withMessage('Status must be Open, In Progress, Resolved, or Closed'),
  body('comment')
    .optional()
    .isString().withMessage('Comment must be a string')
    .bail()
    .isLength({ max: 500 }).withMessage('Comment must be at most 500 characters'),
  validate
];

const validateAssign = [
  body('assignedTo')
    .exists().withMessage('Assigned staff ID is required')
    .bail()
    .isMongoId().withMessage('Assigned staff ID must be a valid ID'),
  validate
];

const validateObjectIdParam = [
  param('id')
    .isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
  validate
];

const validateChangePassword = [
  body('currentPassword')
    .exists().withMessage('Current password is required')
    .bail()
    .isString().withMessage('Current password must be a string')
    .bail()
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .exists().withMessage('New password is required')
    .bail()
    .isString().withMessage('New password must be a string')
    .bail()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .bail()
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from the current password'),
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateComplaint,
  validateStatusUpdate,
  validateAssign,
  validateObjectIdParam,
  validateChangePassword
};
