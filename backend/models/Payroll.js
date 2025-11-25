const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please provide employee']
  },
  month: {
    type: String,
    required: [true, 'Please provide month'],
    match: /^(0[1-9]|1[0-2])-(19|20)\d{2}$/ // Format: MM-YYYY
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  monthlyIncentive: {
    type: Number,
    default: 0,
    min: 0
  },
  mobileRecharge: {
    type: Number,
    default: 0,
    min: 0
  },
  fuelExpense: {
    type: Number,
    default: 0,
    min: 0
  },
  vehicleNumber: {
    type: String,
    default: null,
    trim: true
  },
  giftVoucher: {
    type: Number,
    default: 0,
    min: 0
  },
  otherAllowances: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Paid', 'Cancelled'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true
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

// Compound index to ensure one payroll per employee per month
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Calculate total before saving
PayrollSchema.pre('save', function(next) {
  this.totalAmount = this.baseSalary + 
                     this.monthlyIncentive + 
                     this.mobileRecharge + 
                     this.fuelExpense + 
                     this.giftVoucher + 
                     this.otherAllowances - 
                     this.deductions;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payroll', PayrollSchema);

