require("dotenv").config

const custom = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY : process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_CUSTOMER_URL : process.env.STRIPE_CUSTOMER_URL,
    RETURN_URL : "http://localhost:5173/consultancy/dashboard"
}

module.exports = { custom };