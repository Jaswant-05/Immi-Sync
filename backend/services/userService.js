const { populate } = require("../models/Consultancy");
const User = require("../models/User");

const updateUserService = async(data) => {
  const { userId, ...updates } = data;

  if (!userId) {
    throw new Error("No userId received");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updates,
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error("No user found");
  }

  return updatedUser;
};

const getUserInfo = async(userId) => {
  if(!userId){
    throw new Error(`Missing required field for getting User info`);
  }
  try{
    const user = await User.findOne({ _id : userId }).populate({
      path : "active_application",
      populate : [
        {
          path: "checklist",
          populate : [
            {path : "documents"},
            {path : 'tasks'}
          ]
        },
        { path: "documents" },
        { path: "tasks"}
    ]
      
    });
    return({success: true, user});
  }catch(error){
    throw new Error(`Failed to fetch Users from db ${error.message}`);
  }
};

const removeUser = async(userId) => {
  try{

    if(!userId){
      throw new Error(`Missing Required Fields`);
    }

    const result = await User.deleteOne({ _id : userId});
    return({success: true, message: "User deleted successfully"});

  }catch(error){
    throw new Error(`Failed to Remove User ${error.message}`)
  }
};

module.exports = {
  updateUserService,
  getUserInfo,
  removeUser,
};
