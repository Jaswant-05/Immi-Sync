const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createConsultancy } = require('./consultancyService');
const { createStripeAccount } = require('./stripeService');
const Consultancy = require('../models/Consultancy');
const crypto = require("crypto");
const { sendPasswordResetEmail, sendConfirmationEmail } = require('./resendService');

const signUp = async (data) => {
  const {
    username,
    password,
    role,
    name,
    address,
    phoneNumber,
  } = data;

  console.log(data);
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

  const result = await confirmEmail({
    email: user.username,
  });


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
      throw err
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

  const resetPassword = async(data) => {
    const { email } = data
    try{
      const user = await User.findOne({username : email});
      const token = crypto.randomBytes(32).toString('hex');

      user.password_token = token
      user.password_token_expires = Date.now() + 15 * 60 * 1000;

      await user.save();

      const result = await sendPasswordResetEmail({to : user.username, token})

      if(!result.success){
        throw new Error("Error Sending Reset Email");
      }

      return({success : true})

    }catch(err){
      throw new Error(`Error reseting password ${err.message}`);
    }
  }

  const confirmEmail = async (data) => {
    const { email } = data;

    try {
      const user = await User.findOne({ username: email });
      if (!user) {
        throw new Error("User not found");
      }

      const token = crypto.randomBytes(32).toString("hex");

      user.email_verification_token = token;

      await user.save();

      const result = await sendConfirmationEmail({
        to: user.username, 
        token
      });

      if (!result.success) {
        throw new Error("Error sending confirmation email");
      }

      return { success: true };

    } catch (err) {
      throw new Error(`Error sending confirmation email: ${err.message}`);
    }
  };

  const verifyEmail = async ({ token }) => {

    if (!token) throw new Error('Missing token');

    const user = await User.findOne({ email_verification_token: token });
    if (!user) {
      throw new Error('Invalid verification token');
    }

    const consultancy = await Consultancy.findOne({ admin: user._id });
    console.log(consultancy);
    if (!consultancy) {
      throw new Error("No consultancy found for this user");
    }

    consultancy.status = "verified";
    await consultancy.save();

    user.email_verification_token = undefined;
    await user.save();

    console.log("success")
    return { success: true };
  };


  const completePasswordReset = async ({ token, newPassword }) => {
    if (!token || !newPassword) {
      throw new Error('Missing token or newPassword');
    }

    const user = await User.findOne({
      password_token: token,
      password_token_expires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    user.password_token = undefined;
    user.password_token_expires = undefined;

    await user.save();

    return { success: true };
  };

module.exports = { signUp, signIn, changePassword, resetPassword, confirmEmail, verifyEmail, completePasswordReset };
