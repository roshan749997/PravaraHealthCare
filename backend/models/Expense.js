const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  officeRent: {
    type: Number,
    default: 0
  },
  lightBill: {
    type: Number,
    default: 0
  },
  other: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure unique month-year combination
expenseSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Expense', expenseSchema);



