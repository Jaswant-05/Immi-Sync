const Consultancy = require("../models/Consultancy");
const { createStripeAccount, createCheckoutSession, customerPortal } = require("../services/stripeService");

const stripeController = {
    async createCustomerAccount(req, res){
        try{
            const userId = req.userId;
            const {
                username,
                email
            } = req.body

            if(!username || !email){
                throw new Error(`Missing username or email`);
            }

            const payload = {
                username,
                email
            }

            const result = await createStripeAccount(payload);
            if(!result.success){
                throw new Error("Service Account creation Failed")
            }

            const consultancy = await Consultancy.updateOne({admin : userId}, {stripe_customer_id : result.stripe_customer_id})

            res.json({
                message : "Successfully created stripe customer account "
            })

        }catch(err){
            console.error(`Error Creating Customer Account ${err.message}`)
            res.status(400).json({
                error : `Failed to create a customer account ${err.message}`
            })
        }
    },

    async  createCheckoutSession(req, res) {
        try {
            const userId  = req.userId;
            const { priceId } = req.body;

            if (!priceId) {
                return res.status(400).json({ error: "Price ID is required" });
            }

            const consultancy = await Consultancy.findOne({admin : userId});
            const stripe_customer_id = consultancy.stripe_customer_id;

            if(!stripe_customer_id){
                return res.status(400).json({error: "Customer Id not found"});
            }

            const session = await createCheckoutSession({ priceId, stripe_customer_id });

            return res.status(200).json({
                sessionId: session.id,
                url: session.url,
            });
        }catch (err) {
            console.error("Stripe Checkout Error:", err);
            return res.status(500).json({
                error: `Failed to create checkout session: ${err.message}`,
            });
        }
    },
    async createCustomerSession(req, res) {
        try {
            const userId = req.userId;
            const consultancy = await Consultancy.findOne({admin : userId});
            const stripe_customer_id = consultancy.stripe_customer_id;

            if(!stripe_customer_id){
                return res.status(400).json({error: "Customer Id not found"});
            }

            const portal = await customerPortal({ stripe_customer_id });

            return res.status(200).json(portal);
        } catch (err) {
        console.error("Stripe Portal Error:", err);
        return res.status(500).json({
            success: false,
            error: `Failed to create customer portal session: ${err.message}`,
        });
    }
  },
}

module.exports = stripeController