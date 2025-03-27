const { Router } = require('express');
const { signIn } = require('../controllers/auth/sign-in');


const router = Router();

/* User sign-in endpoint */
router.get('/sign-in', signIn);

/* User sign-up endpoint */
router.get('/sign-up', signUp);

module.exports = router;