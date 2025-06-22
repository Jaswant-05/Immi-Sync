const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  consultancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultancy',
  },
  address: { type: String, required: true },
  longitude: { type: String, required: true},
  latitude: { type: String, required: true}
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
