const express = require('express');
const router = express.Router();
const Allowance = require('../models/Allowance');
const Employee = require('../models/Employee');

// Get all allowances
router.get('/', async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const allowances = await Allowance.find(query)
      .populate('employeeId', 'name employeeId department')
      .sort({ year: -1, month: -1 });
    
    res.json({ success: true, data: allowances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get allowance summary
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const allowances = await Allowance.find(query);
    const totalRecharge = allowances.reduce((sum, a) => sum + a.mobileRecharge, 0);
    const totalPetrol = allowances.reduce((sum, a) => sum + (a.petrolDiesel?.amount || 0), 0);
    const totalIncentive = allowances.reduce((sum, a) => sum + a.incentive, 0);
    const totalGifts = allowances.reduce((sum, a) => sum + a.gifts, 0);

    res.json({
      success: true,
      data: {
        totalRecharge,
        totalPetrol,
        totalIncentive,
        totalGifts,
        totalAllowances: totalRecharge + totalPetrol + totalIncentive + totalGifts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single allowance
router.get('/:id', async (req, res) => {
  try {
    const allowance = await Allowance.findById(req.params.id)
      .populate('employeeId');
    if (!allowance) {
      return res.status(404).json({ success: false, message: 'Allowance not found' });
    }
    res.json({ success: true, data: allowance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create allowance
router.post('/', async (req, res) => {
  try {
    const allowance = new Allowance(req.body);
    await allowance.save();
    await allowance.populate('employeeId', 'name employeeId department');
    res.status(201).json({ success: true, data: allowance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update allowance
router.put('/:id', async (req, res) => {
  try {
    const allowance = await Allowance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name employeeId department');
    
    if (!allowance) {
      return res.status(404).json({ success: false, message: 'Allowance not found' });
    }
    res.json({ success: true, data: allowance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete allowance
router.delete('/:id', async (req, res) => {
  try {
    const allowance = await Allowance.findByIdAndDelete(req.params.id);
    if (!allowance) {
      return res.status(404).json({ success: false, message: 'Allowance not found' });
    }
    res.json({ success: true, message: 'Allowance deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



