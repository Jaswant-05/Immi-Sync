const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['client', 'consultancy', 'admin'],
    default: 'client',
    required: true,
  },
  consultancy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultancy',
  }],
  application_type: {
    type: String,
    enum: ['Visitor', 'Work', 'PR', 'citizenship', 'other'],
  },
  application_status: {
    type: String,
    enum: ['Draft', 'Applied', 'Approved', 'Declined'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
