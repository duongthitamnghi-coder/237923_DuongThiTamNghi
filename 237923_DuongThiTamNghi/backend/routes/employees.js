const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const router = express.Router();

function validId(id) {
  return mongoose.isValidObjectId(id);
}

// GET /api/employees - Danh sach va tim kiem
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search && search.trim()) {
      const keyword = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(keyword, 'i');

      filter = {
        $or: [
          { employeeId: regex },
          { fullName: regex },
          { email: regex },
          { position: regex },
          { department: regex }
        ]
      };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
});

// GET /api/employees/:id - Chi tiet nhan vien
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID khong hop le' });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Khong tim thay nhan vien' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
});

// POST /api/employees - Them nhan vien
router.post('/', async (req, res, next) => {
  try {
    const { employeeId, fullName, email, position, department, salary } = req.body;

    if (!employeeId || !fullName || !email || !position || !department ||
        salary === undefined || salary === null || salary === '') {
      return res.status(400).json({
        success: false,
        message: 'Vui long nhap day du ma NV, ho ten, email, chuc vu, phong ban va luong'
      });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Them nhan vien thanh cong',
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/employees/:id - Cap nhat nhan vien
router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID khong hop le' });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Khong tim thay nhan vien' });
    }

    res.status(200).json({
      success: true,
      message: 'Cap nhat nhan vien thanh cong',
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/employees/:id - Xoa nhan vien
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID khong hop le' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Khong tim thay nhan vien' });
    }

    res.status(200).json({
      success: true,
      message: 'Xoa nhan vien thanh cong',
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
