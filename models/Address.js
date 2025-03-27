const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  consultancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultancy',
  },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
