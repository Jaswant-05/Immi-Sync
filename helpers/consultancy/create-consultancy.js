const Address = require("../../models/Address");
const Consultancy = require("../../models/Consultancy");
const createAddress = require("../address/create-address");

const createConsultancy = async (userId ,name, address, phoneNumber) => {

  if (!name || !address || !phoneNumber || !userId) {
    throw new Error("Missing parameters for creating a new Consultancy");
  }

  const newConsultancy = await Consultancy.create({
    name,
    phoneNumber,
    status: "unverified",
    user: userId,
  });

  const addressPayload = createAddress(address);
  if (!addressPayload) {
    throw new Error("Invalid address parameters");
  }

  const newAddress = await Address.create(addressPayload);
  if (!newAddress) {
    throw new Error("Error creating address object");
  }

  newConsultancy.address = newAddress.id;
  await newConsultancy.save();

  return newConsultancy;
};

module.exports = {
  createConsultancy,
};
