const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  consultancyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultancy",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  isDone: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model("Task", taskSchema);
