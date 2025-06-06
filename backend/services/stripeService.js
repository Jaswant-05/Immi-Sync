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
    async addCreditCard({paymentMethodId, customerId}){
        const paymentMethod = stripe.paymentMethods.retrieve(paymentMethodId);
        

    }
}
