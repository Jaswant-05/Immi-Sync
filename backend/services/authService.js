const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createConsultancy } = require('./consultancyService');
const Consultancy = require('../models/Consultancy');

const signUp = async (data) => {
  const { username, password, role, name, address, phoneNumber, applicationType, consultancyId } = data;

  if (!username || !password || !role) {
    throw new Error('Missing required fields');
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  if (role === 'consultancy') {
    if (!name || !address || !phoneNumber) {
      throw new Error('Missing consultancy details');
    }

    const consultancy = await createConsultancy(user._id, name, address, phoneNumber);
    user.consultancy.push(consultancy._id);
    await user.save();
  }
  else if(role === 'client'){
    if(!applicationType || !consultancyId){
        throw new Error('Missing client details');
    }

    user.application_type = applicationType;
    user.application_status = "Draft"
    user.consultancy.push(consultancyId);
    await user.save();    

    const consultancy = await Consultancy.findOne({_id : consultancyId});
    if(!consultancy){
        throw new Error("consultancy not found");
    }
    consultancy.users.push(user._id);
    await consultancy.save();
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
        token
      };
  
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

module.exports = { signUp, signIn };
