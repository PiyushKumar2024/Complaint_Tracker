const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please select a department']
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    location: {
      address: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' }
    },
    attachments: [
      {
        type: String,
        trim: true
      }
    ],
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timeline: [
      {
        status: {
          type: String,
          required: true
        },
        comment: {
          type: String,
          default: ''
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

complaintSchema.pre('save', function (next) {
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline.push({
      status: this.status || 'Open',
      comment: 'Complaint registered',
      updatedBy: this.filedBy,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
