const express = require('express');
const router = express.Router();
const { signUp, signIn, changePassword, resendConfirmationEmail, verifyEmail, requestPasswordReset, completePasswordReset} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/Auth');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.put('/change-password', authMiddleware, changePassword)

router.post('/confirm-email', resendConfirmationEmail);
router.get('/verify-email', verifyEmail);

router.post('/reset-password', requestPasswordReset);
router.post('/complete-password-reset', completePasswordReset);

module.exports = router;
