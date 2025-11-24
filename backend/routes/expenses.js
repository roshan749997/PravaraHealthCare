const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const { month, year, startMonth, endMonth, startYear, endYear } = req.query;
    
    const query = {};
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    } else if (startMonth && endMonth && startYear && endYear) {
      query.$or = [];
      for (let y = parseInt(startYear); y <= parseInt(endYear); y++) {
        const startM = y === parseInt(startYear) ? parseInt(startMonth) : 1;
        const endM = y === parseInt(endYear) ? parseInt(endMonth) : 12;
        for (let m = startM; m <= endM; m++) {
          query.$or.push({ month: m, year: y });
        }
      }
    }

    const expenses = await Expense.find(query).sort({ year: -1, month: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get expense summary
router.get('/summary', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ year: -1, month: -1 });
    const totalRent = expenses.reduce((sum, e) => sum + e.officeRent, 0);
    const totalLightBill = expenses.reduce((sum, e) => sum + e.lightBill, 0);
    const totalOther = expenses.reduce((sum, e) => sum + e.other, 0);
    const totalExpenses = totalRent + totalLightBill + totalOther;
    const avgMonthly = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    res.json({
      success: true,
      data: {
        totalRent,
        totalLightBill,
        totalOther,
        totalExpenses,
        avgMonthly: Math.round(avgMonthly),
        totalMonths: expenses.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



