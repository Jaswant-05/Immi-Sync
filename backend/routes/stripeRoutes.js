const express = require("express");
const { authMiddleware } = require("../middleware/Auth");
const { createCheckoutSession, createCustomerSession, createCustomerAccount, webhookHandler } = require("../controllers/stripeController");

const router = express.Router();

router.post('/create-customer-account', authMiddleware, createCustomerAccount);
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.post('/create-customer-session', authMiddleware, createCustomerSession);
router.post('/webhook', webhookHandler);

module.exports = router