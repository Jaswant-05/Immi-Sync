const mongoose = require("mongoose");

const consultancySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  subscriptionStatus: {
    type: String,
    enum: ["Active", "Cancelled"],
    default: "Active"
  },
  dateOfRegistration: {
    type: Date,
    default: Date.now
  },

  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  paymentMethod: String,
  
  stripeCustomerId: {
    type: String,
    required: false
  },

  isAuthenticated: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Consultancy", consultancySchema);
