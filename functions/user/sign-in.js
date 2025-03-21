const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const signIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password){
    return res.status(400).json({ message: "Invalid parameters" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user){
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = {
      userId: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      token,
      user
    });

  } catch (err) {
    console.error('Sign in error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signIn };
