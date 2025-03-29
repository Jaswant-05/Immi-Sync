const User = require("../models/User");

const updateUserService = async (data) => {
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

module.exports = {
  updateUserService,
};
