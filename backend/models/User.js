const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
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
  active_application : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  
});

const User = mongoose.model('User', userSchema);
module.exports = User;
