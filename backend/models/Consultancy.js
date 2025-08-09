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
    required: false
  },
  subscription_status : {
    type: String,
    enum : ['active', 'inactive'],
    required: false
  },
  subscription_plan : {
    type: String,
    enum : ["basic", "standard", "plus"],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    required: false,
  }
});

const Consultancy = mongoose.model('Consultancy', consultancySchema);
module.exports = Consultancy;
