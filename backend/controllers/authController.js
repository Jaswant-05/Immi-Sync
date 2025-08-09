const authService = require('../services/authService');

const signUp = async (req, res) => {
  try {
    const result = await authService.signUp(req.body);
    return res.status(201).json({ message: 'User created successfully', result });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
    try {
        const response = await authService.signIn(req.body);
        return res.status(201).json({ message: 'Sign-In successfully', user : response.user, token: response.token, subscription_status: response.subscription_status });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
}

const changePassword = async (req, res) => {
  try {
    const data = {
      userId : req.userId,
      oldPassword : req.body.oldPassword,
      newPassword : req.body.newPassword
    }

    console.log(data)

    await authService.changePassword(data);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { signUp, signIn, changePassword };
