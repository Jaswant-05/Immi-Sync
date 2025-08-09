const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { createStripeAccount, createCheckoutSession, customerPortal, handleCheckoutCompleted, handleSubscriptionCreated, handleSubscriptionUpdated, handleSubscriptionDeleted, handleInvoicePaid, handleInvoicePaymentFailed } = require("../services/stripeService");
const Consultancy = require('../models/Consultancy');

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
            console.log("reached here");
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
  async webhookHandler(req,res){
    let data;
    let eventType;
    let event;
    let signature = req.headers["stripe-signature"]

    try{
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }catch (err) {
        console.error("Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    data = event.data;
    eventType = event.type;
    const obj = event.data?.object;

    try{
        switch (eventType) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(obj);
            break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(obj);
            break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(obj);
            break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(obj);
            break;

            case 'invoice.paid':
                await handleInvoicePaid(obj);
            break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(obj);
            break;

            default:
                console.log('Unhandled event type:', eventType);
            break;
        }

    res.status(200)

    }catch(err){
       onsole.error('Webhook handler error:', err);
      return res.sendStatus(200);
    }
    
  }
}

module.exports = stripeController