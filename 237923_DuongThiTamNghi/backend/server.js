require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HR Management API is running'
  });
});

app.use('/api/employees', employeeRoutes);

// Xu ly loi chung
app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Ma nhan vien da ton tai'
    });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON khong hop le'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Loi server'
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Thieu bien moi truong MONGODB_URI trong file .env');
    }

await mongoose.connect(process.env.MONGODB_URI);

console.log('Da ket noi MongoDB Atlas');
console.log('Database dang dung:', mongoose.connection.name);
console.log(
  'Collection dang dung:',
  mongoose.connection.collection('employees').collectionName
);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server dang chay tai cong ${PORT}`);
    });
  } catch (error) {
    console.error('Khong the khoi dong server:', error.message);
    process.exit(1);
  }
}

startServer();
