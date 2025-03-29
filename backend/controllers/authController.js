const authService = require('../services/authService');

const signUp = async (req, res) => {
  try {
    const user = await authService.signUp(req.body);
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
    try {
        const response = await authService.signIn(req.body);
        return res.status(201).json({ message: 'Sign-In successfully', user : response.user, token: response.token });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
}

module.exports = { signUp, signIn };
