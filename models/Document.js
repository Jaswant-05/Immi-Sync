const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
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
  link: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model("Document", documentSchema);
