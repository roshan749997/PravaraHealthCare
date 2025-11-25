const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  month: {
    type: String,
    required: [true, 'Please provide month'],
    match: /^(0[1-9]|1[0-2])-(19|20)\d{2}$/ // Format: MM-YYYY
  },
  year: {
    type: Number,
    required: true
  },
  officeRent: {
    type: Number,
    required: [true, 'Please provide office rent'],
    min: 0
  },
  utilities: {
    type: Number,
    required: [true, 'Please provide utilities amount'],
    min: 0
  },
  other: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one expense entry per month
ExpenseSchema.index({ month: 1, year: 1 }, { unique: true });

ExpenseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Expense', ExpenseSchema);

