const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
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
  salary: {
    type: Number,
    required: true
  },
  allowances: {
    mobileRecharge: { type: Number, default: 0 },
    petrolDiesel: { type: Number, default: 0 },
    incentive: { type: Number, default: 0 },
    gifts: { type: Number, default: 0 }
  },
  totalCompensation: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Paid'],
    default: 'Pending'
  },
  processedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure unique employee-month-year combination
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);



