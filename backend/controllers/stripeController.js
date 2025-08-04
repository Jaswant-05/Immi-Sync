const stripeController = {
    async createCheckoutSession(req, res) {
        try {
            const { priceId } = req.body;

            if (!priceId) {
                return res.status(400).json({ error: "Price ID is required" });
            }

            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                billing_address_collection: "auto",
                subscription_data: {
                trial_period_days: 14,
                },
                success_url: 'http://localhost:5173/?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:5173',
            });

            res.status(200).json({ sessionId: session.id, url: session.url });
            
            } catch (err) {
                console.error("Stripe Checkout Error:", err);
                res.status(500).json({ error: `Failed to create checkout session: ${err.message}` });
            }
    },
    async createCustomerSession(req, res){

    }
}