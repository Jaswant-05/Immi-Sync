const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createConsultancy } = require('./consultancyService');
const { createStripeAccount } = require('./stripeService');
const Consultancy = require('../models/Consultancy');

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

    const stripePayload = {
      username: name,
      email: username
    }
    const result = await createStripeAccount(stripePayload);
    const stripe_customer_id =  result.stripe_customer_id;

    await Consultancy.findByIdAndUpdate(consultancy._id, {stripe_customer_id})
  }

  const payload = {
    userId : user._id,
    role : user.role
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  return {
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
    token,
    role : user.role,
  };
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

      let subscription_status;
      if(user.role === "consultancy"){
        const consultancy = await Consultancy.findOne({admin : user._id}).lean();
        if(!consultancy){
          throw new Error("Consultancy not found");
        }

        subscription_status = consultancy.subscription_status;
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
        subscription_status
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
