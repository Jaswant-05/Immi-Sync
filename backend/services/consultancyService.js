const Consultancy = require('../models/Consultancy');
const Address = require('../models/Address');
const createAddress = require('../helpers/address/createAddress');
const User = require('../models/User');
const Application = require('../models/Application')

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
 
const getAllConsultancies = async(filters) => {
  const {
    user,
    application,
    limit = 500,
    page = 1,
    sort = { createdAt : -1 }
  } = filters

  const query = {}

  if(user) query.user = user
  if(application) query.application = application
  const skip = (page - 1) * limit;

  const consultancies = await Consultancy.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

  if(!consultancies){
    throw new Error("Error in Fetching Consultancies")
  }

  return {success : true , consultancies}
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
    try {
        console.log(data);
        const { consultancyId, address, ...updates } = data;
      
        if (!consultancyId) {
            throw new Error(`Missing consultancyId for updating consultancy`);
        }

        if (Object.keys(updates).length === 0) {
            throw new Error(`No updates provided for consultancy`);
        }

        const consultancy = await Consultancy.findByIdAndUpdate(
            consultancyId, 
            updates,  
            { 
                new: true,
                runValidators: true
            }
        );

        let addressPayload = {};
        let updatedAddress = {};
        
        if(address){
          addressPayload = {
            address : address.addressString,
            longitude: address.longitude,
            latitude : address.latitude,
            updatedAt : Date.now()
          } 

          updatedAddress = await Address.findByIdAndUpdate(consultancy.address, addressPayload);

          console.log(updatedAddress);
          
          if(!updatedAddress) {
            throw new Error(`Error updating address`)
          }
        }

        if (!consultancy) {
            throw new Error(`Consultancy not found with id: ${consultancyId}`);
        }

        return { success: true, consultancy, updatedAddress };

    } catch (error) {
        console.error('Error updating Consultancy Information:', error);
        return { success: false, error: error.message };
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

const getApplication = async (consultancyId) => {
  if(!consultancyId){
    throw new Error("Missing consultancy Id");
  }
  try{
    const applications = await Application.find( { consultancy: consultancyId }).populate('checklist');
    return({success: true, applications});
  }catch(error){
    throw new Error(`Error fetchign applications: ${error.message}`);
  }
}

module.exports = { 
  createConsultancy,
  removeConsultancy,
  updateConsultancy,
  getAllConsultancies,
  getUsers,
  getApplication
};
