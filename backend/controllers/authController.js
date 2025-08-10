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

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    await authService.resetPassword({ email });
    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const resendConfirmationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    await authService.confirmEmail({ email });
    return res.status(200).json({ message: 'Confirmation email sent' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    await authService.verifyEmail({ token });
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const completePasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and newPassword are required' });
    }

    await authService.completePasswordReset({ token, newPassword });
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { signUp, signIn, changePassword, requestPasswordReset, resendConfirmationEmail, verifyEmail, completePasswordReset };
