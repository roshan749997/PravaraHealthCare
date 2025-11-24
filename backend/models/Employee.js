const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Clinical', 'Administrative', 'Support Services', 'Technical', 'Other'],
    default: 'Other'
  },
  designation: {
    type: String,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  salary: {
    monthly: {
      type: Number,
      required: true,
      default: 0
    },
    annual: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate annual salary before saving
employeeSchema.pre('save', function(next) {
  if (this.salary.monthly && !this.salary.annual) {
    this.salary.annual = this.salary.monthly * 12;
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);



