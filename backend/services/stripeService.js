require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
    async createAccount({usernmae, email}){
        const customer = stripe.customer.create({
            name : usernmae,
            email : email
        })

        return({success : true, stripe_customer_id : customer.id})
    },
    
    async createCheckoutSession(req, res) {
        try {
            const { priceId } = req.body;

            if (!priceId) {
                return res.status(400).json({ error: "Price ID is required" });
            }

            const session = await stripeService.createCheckoutSession({ priceId });

            res.status(200).json({ sessionId: session.id, url: session.url });
        } catch (err) {
            console.error("Stripe Checkout Error:", err);
            res.status(500).json({ error: `Failed to create checkout session: ${err.message}` });
        }
    },

    async customerPortal({stripe_customer_id}){

    },
}
