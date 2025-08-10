const authService = require('../services/authService');

const signUp = async (req, res) => {
  try {
    const result = await authService.signUp(req.body);
    return res.status(201).json({ message: 'User created successfully', result });
  } catch (err) {
    console.error('SignUp error:', err);
    
    if (err.message === 'User already exists') {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    if (err.message === 'Missing required fields' || err.message === 'Missing consultancy details') {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

const signIn = async (req, res) => {
  try {
    const response = await authService.signIn(req.body);
    return res.status(200).json({ 
      message: 'Sign-In successful', 
      user: response.user, 
      token: response.token, 
      subscription_status: response.subscription_status 
    });
  } catch (err) {
    console.error('SignIn error:', err);
    
    if (err.message === 'Unable to find user') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (err.message === 'Invalid Password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (err.message === 'Invalid Parameters') {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    if (err.message === 'Consultancy not found') {
      return res.status(404).json({ message: 'Consultancy profile not found' });
    }
    
    // Server errors
    return res.status(500).json({ message: 'Internal server error during sign-in' });
  }
};

const changePassword = async (req, res) => {
  try {
    const data = {
      userId: req.userId,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword
    };
    
    await authService.changePassword(data);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    
    if (err.message === 'Invalid Parameters') {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }
    
    if (err.message === 'Invalid Old Password') {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    return res.status(500).json({ message: 'Internal server error during password change' });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    await authService.resetPassword({ email });
    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Password reset request error:', err);
    
    if (err.message.includes('User not found')) {
      return res.status(200).json({ message: 'Password reset email sent if account exists' });
    }
    
    return res.status(500).json({ message: 'Internal server error during password reset request' });
  }
};

const resendConfirmationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    await authService.confirmEmail({ email });
    return res.status(200).json({ message: 'Confirmation email sent' });
  } catch (err) {
    console.error('Resend confirmation error:', err);
    
    if (err.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(500).json({ message: 'Internal server error during email confirmation' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    
    await authService.verifyEmail({ token });
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification error:', err);
    
    if (err.message === 'Invalid verification token') {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    
    if (err.message === 'No consultancy found for this user') {
      return res.status(404).json({ message: 'Consultancy profile not found' });
    }
    
    return res.status(500).json({ message: 'Internal server error during email verification' });
  }
};

const completePasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    
    await authService.completePasswordReset({ token, newPassword });
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Complete password reset error:', err);
    
    if (err.message === 'Invalid or expired reset token') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    return res.status(500).json({ message: 'Internal server error during password reset' });
  }
};

module.exports = { 
  signUp, 
  signIn, 
  changePassword, 
  requestPasswordReset, 
  resendConfirmationEmail, 
  verifyEmail, 
  completePasswordReset 
};