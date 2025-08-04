const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createConsultancy } = require('./consultancyService');

const signUp = async (data) => {
  const {
    username,
    password,
    role,
    name,
    address,
    phoneNumber,
  } = data;

  // Validate base user fields
  if (!username || !password || !role) {
    throw new Error("Missing required fields");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("User already exists");
  }

  if (role === "consultancy") {
    if (!name || !address || !phoneNumber) {
      throw new Error("Missing consultancy details");
    }
  }

  // All checks passed, now safely create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashedPassword,
    role
  });

  // Add role-specific info
  if (role === "consultancy") {
    const consultancy = await createConsultancy(user._id, name, address, phoneNumber);
    user.consultancy.push(consultancy._id);
    await user.save();
  }

  return user;
};


const signIn = async (data) => {
    const { username, password } = data;
  
    if (!username || !password){
        throw new Error("Invalid Parameters")
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user){
        throw new Error("Unable to find user")
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch){
        throw new Error("Invalid Password")
      }
  
      const payload = {
        userId: user._id,
        role: user.role
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      return {
        user,
        token,
        role : user.role,
      };
  
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const changePassword = async(data) => {
    const {
      userId,
      oldPassword,
      newPassword
    } = data

    const user = await User.findOne({_id : userId});

    if(!userId || !oldPassword || !newPassword){
      throw new Error("Invaid Parameters")
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
      throw new Error("Invalid Old Password");
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    await user.save()
  }

module.exports = { signUp, signIn, changePassword };
