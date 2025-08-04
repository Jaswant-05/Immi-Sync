const express = require('express');
const router = express.Router();
const { signUp, signIn, changePassword} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/Auth');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.put('/change-password', authMiddleware, changePassword)

module.exports = router;
