const Consultancy = require('../models/Consultancy');
const Address = require('../models/Address');
const createAddress = require('../helpers/address/createAddress');

const createConsultancy = async (userId, name, address, phoneNumber) => {
  if (!userId || !name || !address || !phoneNumber) {
    throw new Error('Missing consultancy fields');
  }

  const consultancy = await Consultancy.create({
    name,
    phoneNumber,
    status: 'unverified',
    admin: userId,
  });

  const addressPayload = createAddress({ ...address, consultancy_id: consultancy._id });
  const newAddress = await Address.create(addressPayload);

  consultancy.address = newAddress._id;
  await consultancy.save();

  return consultancy;
};

module.exports = { createConsultancy };
