const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  consultancyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultancy",
    required: true
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
  applicationStatus: {
    type: String,
    enum: ["Draft", "Filed", "Decision"],
    required: true
  },
  applicationCreateDate: {
    type: Date,
    default: Date.now
  },
  applicationFileDate: {
    type: Date
  },
  applicationType: {
    type: String,
    enum: ["Visitor", "Student", "Work", "PR"],
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
