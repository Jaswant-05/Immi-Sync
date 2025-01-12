const Consultancy = require('../models/Consultancy.js');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.consultancySignup = async (req, res) => {
  try {
    const { name, username, password, phoneNumber, address } = req.body;

    // Check if username already exists
    const existingConsultancy = await Consultancy.findOne({ username });
    if (existingConsultancy) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newConsultancy = new Consultancy({
      name,
      username,
      password: hashedPassword,
      phoneNumber,
      address,
      isAuthenticated: false, // or you can set to true if you want to skip manual admin verification
      isVerified: false       // For Admin to verify later
    });

    await newConsultancy.save();
    return res.status(201).json({ message: 'Consultancy registered successfully. Pending admin approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.consultancySignin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const consultancy = await Consultancy.findOne({ username });
    if (!consultancy) {
      return res.status(404).json({ message: 'Consultancy not found' });
    }

    const isMatch = await bcrypt.compare(password, consultancy.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!consultancy.isVerified) {
      return res.status(403).json({ message: 'Consultancy is not verified by admin yet.' });
    }

    // Generate token
    const token = jwt.sign({ id: consultancy._id }, 'SECRET_KEY', { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Signed in successfully',
      token,
      consultancy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.userSignup = async (req, res) => {
  try {
    const { consultancyId, username, password, applicationType } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Check that consultancy is verified
    const consultancy = await Consultancy.findById(consultancyId);
    if (!consultancy || !consultancy.isVerified) {
      return res.status(400).json({ message: 'Invalid or unverified consultancy' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      consultancyId,
      username,
      password: hashedPassword,
      applicationType,
      applicationStatus: 'Draft'
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.userSignin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '1d' });

    return res.status(200).json({
      message: 'User signed in successfully',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
