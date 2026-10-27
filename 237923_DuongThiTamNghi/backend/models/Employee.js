const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Ma nhan vien la bat buoc'],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Ho ten la bat buoc'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email la bat buoc'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    position: {
      type: String,
      required: [true, 'Chuc vu la bat buoc'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Phong ban la bat buoc'],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, 'Luong la bat buoc'],
      min: [0, 'Luong khong duoc am']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
