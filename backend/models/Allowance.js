const mongoose = require('mongoose');

const allowanceSchema = new mongoose.Schema({
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
  mobileRecharge: {
    type: Number,
    default: 0
  },
  petrolDiesel: {
    amount: {
      type: Number,
      default: 0
    },
    vehicleNumber: {
      type: String,
      trim: true
    }
  },
  incentive: {
    type: Number,
    default: 0
  },
  gifts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure unique employee-month-year combination
allowanceSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Allowance', allowanceSchema);

