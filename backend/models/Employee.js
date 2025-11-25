const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Please provide employee ID'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please provide blood group'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
    enum: ['Clinical', 'Administrative', 'Support Services', 'Technical', 'Other']
  },
  designation: {
    type: String,
    trim: true
  },
  joinDate: {
    type: Date,
    required: [true, 'Please provide join date']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  monthlySalary: {
    type: Number,
    required: [true, 'Please provide monthly salary'],
    min: 0
  },
  annualPackage: {
    type: Number,
    required: [true, 'Please provide annual package'],
    min: 0
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

EmployeeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);

