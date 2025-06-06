const mongoose = require('mongoose');

const consultancySchema = new mongoose.Schema({
  name: { type: String },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  phoneNumber: { type: Number, required: true },
  admin : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  status: {
    type: String,
    enum: ['verified', 'unverified', 'unpublished'],
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  stripe_customer_id : {
    type: String,
  },
});

const Consultancy = mongoose.model('Consultancy', consultancySchema);
module.exports = Consultancy;
