const mongoose = require('mongoose');

const DashboardDataSchema = new mongoose.Schema({
  month: {
    type: String,
    required: [true, 'Please provide month'],
    match: /^(0[1-9]|1[0-2])-(19|20)\d{2}$/ // Format: MM-YYYY
  },
  year: {
    type: Number,
    required: true
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0
  },
  orders: {
    type: Number,
    default: 0,
    min: 0
  },
  avgOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  newCustomers: {
    type: Number,
    default: 0,
    min: 0
  },
  revenueDistribution: {
    consultation: { type: Number, default: 0 },
    diagnostics: { type: Number, default: 0 },
    pharmacy: { type: Number, default: 0 },
    surgery: { type: Number, default: 0 },
    otherServices: { type: Number, default: 0 }
  },
  employeeDistribution: {
    clinicalStaff: { type: Number, default: 0 },
    administrative: { type: Number, default: 0 },
    supportServices: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
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

// Compound index to ensure one dashboard entry per month
DashboardDataSchema.index({ month: 1, year: 1 }, { unique: true });

DashboardDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DashboardData', DashboardDataSchema);

