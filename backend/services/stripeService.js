require('dotenv').config();
const Stripe = require('stripe');
const { custom } = require('../config/custom');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
    async createStripeAccount({ username, email }) {
        try {
            const customer = await stripe.customers.create({
            name: username,
            email: email
            });
            return { success: true, stripe_customer_id: customer.id };
        } catch (err) {
            throw new Error(`Stripe customer creation failed: ${err.message}`);
        }
    },

    async createCheckoutSession({priceId, stripe_customer_id}){
        try{
            if(!priceId){
                throw new Error("Price Id not found")
            }
            const session = await stripe.checkout.sessions.create({
                mode : "subscription",
                customer: stripe_customer_id,
                line_items : [
                    {
                        price : priceId,
                        quantity : 1
                    }
                ],
                billing_address_collection : "auto",
                subscription_data : {
                    trial_period_days : 14,
                },
                // automatic_tax : {
                //     enabled : true
                // },
                success_url: 'http://localhost:5173/?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:5173',
            })

            return session 
            
        }catch(err){
            throw new Error(`Error creating checkout session: ${err.message}`)
        }
    },

    async customerPortal({stripe_customer_id}){
        try{

            if(!stripe_customer_id){
                throw new Error("Customer ID not found")
            }

            const portalSession = await stripe.billingPortal.sessions.create({
                customer: stripe_customer_id,
                return_url: custom.RETURN_URL,
            });

            if(!portalSession){
                throw new Error("Error creating Portal Session");
            }

            return {
                success: true,
                url: portalSession.url,
            };

        }catch(err){
            throw new Error(`Error creating customer portal: ${err.message}`)
        }
    },
}
