const { Router } = require('express');
const { signIn } = require('../functions/user/sign-in');
const { signUp } = require('../functions/user/sign-up');


const router = Router();

/* User sign-in endpoint */
router.get('/sign-in', signIn);

/* User sign-up endpoint */
router.get('/sign-up', signUp);

module.exports = router;