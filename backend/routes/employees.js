const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const { search, department, status, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 100 } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department && department !== 'All') {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const employees = await Employee.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get employee by employeeId (for user panel)
router.get('/by-employee-id/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: 'Inactive' },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk update status
router.put('/bulk/status', async (req, res) => {
  try {
    const { employeeIds, status } = req.body;
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Employee IDs array required' });
    }
    const result = await Employee.updateMany(
      { _id: { $in: employeeIds } },
      { $set: { status } }
    );
    res.json({ success: true, data: { modified: result.modifiedCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk delete
router.delete('/bulk', async (req, res) => {
  try {
    const { employeeIds } = req.body;
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Employee IDs array required' });
    }
    const result = await Employee.updateMany(
      { _id: { $in: employeeIds } },
      { $set: { status: 'Inactive' } }
    );
    res.json({ success: true, data: { modified: result.modifiedCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export employees to CSV
router.get('/export/csv', async (req, res) => {
  try {
    const employees = await Employee.find({});
    const csvHeader = 'Employee ID,Name,Email,Phone,Department,Designation,Join Date,Monthly Salary,Annual Salary,Status\n';
    const csvRows = employees.map(emp => {
      const joinDate = emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : '';
      return `${emp.employeeId},"${emp.name}","${emp.email || ''}","${emp.phone || ''}",${emp.department},"${emp.designation || ''}",${joinDate},${emp.salary.monthly},${emp.salary.annual},${emp.status}`;
    }).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



