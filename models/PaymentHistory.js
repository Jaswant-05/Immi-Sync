const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  consultancyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultancy",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ["Stripe", "Other"],
    default: "Stripe"
  },
  transactionId: {
    type: String,
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  stripeCustomerId: {
    type: String
  },
  status: {
    type: String,
    enum: ["Succeeded", "Failed", "Pending", "Cancelled"],
    required: true
  },
  currency: {
    type: String,
    default: "USD",
    required: true
  },
  receiptUrl: {
    type: String
  }
});

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
