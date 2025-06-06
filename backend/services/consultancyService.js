const Consultancy = require('../models/Consultancy');
const Address = require('../models/Address');
const createAddress = require('../helpers/address/createAddress');
const User = require('../models/User');

const createConsultancy = async(userId, name, address, phoneNumber) => {
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
 
const removeConsultancy = async(consultancyId) => {
  if(!consultancyId){
    throw new Error('Missing consultancy Id');
  }
  try{
    await Consultancy.updateOne({ _id: consultancyId }, { status : "unpublished"});
    return ({success : true})
  }
  catch(error){
    throw new Error(`Error removing consultancy ${error.message}`);
  }
};

const updateConsultancy = async(data) => {
  try{
    const { consultancyId, ...updates} = data;
    if(!consultancyId){
      throw new Error(`Missing Fields for updating consultancy`)
    }

    const consultancy = await Consultancy.updateOne({_id : consultancyId}, { updates });
    return({success: true, consultancy});

  }catch(error){
    throw new Error('Error updating Consultancy Information');
  }
};

const getUsers = async (consultancyId) => {
  if(!consultancyId){
    throw new Error('Missing consultancy Id');
  }
  try{
    const users = await User.find( { consultancy : consultancyId, role : 'client' } );
    return({success: true, users})
  }catch(error){
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

module.exports = { 
  createConsultancy,
  removeConsultancy,
  updateConsultancy,
  getUsers,
};
