require('dotenv').config();
const Stripe = require('stripe');
const { custom } = require('../config/custom');
const Consultancy = require('../models/Consultancy');
const SubscriptionUsage = require('../models/subscriptionUsage');
const plans = require('../utils/plan');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

function priceIdToPlan(priceId) {
  if (!priceId) return null;
  for (const [planKey, cfg] of Object.entries(plans)) {
    const pid = cfg?.price_id;
    if (!pid) continue;
    if (pid.monthly === priceId || pid.yearly === priceId) return planKey;
  }
  return null;
}

async function findConsultancyByCustomer(stripeCustomerId) {
  if (!stripeCustomerId) return null;
  return Consultancy.findOne({ stripe_customer_id: stripeCustomerId }).lean();
}

async function ensureUsageRow(consultancyId, planKey) {
  await SubscriptionUsage.updateOne(
    { consultancy: consultancyId },
    {
      $setOnInsert: { users: 1, applications: 0 },
      $set: { plan: planKey },
    },
    { upsert: true }
  );
}

async function setConsultancySubscription(consultancyId, status, planKey, stripeCustomerId) {
  const $set = { subscription_status: status, updatedAt: new Date() };
  if (planKey) $set.subscription_plan = planKey;
  if (stripeCustomerId) $set.stripe_customer_id = stripeCustomerId;
  await Consultancy.updateOne({ _id: consultancyId }, { $set });
}

async function getPlanFromSubscriptionId(subscriptionId) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  });
  const firstItem = sub?.items?.data?.[0];
  const priceId = firstItem?.price?.id;
  return { planKey: priceIdToPlan(priceId), subscription: sub };
}

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
                success_url: 'http://localhost:5173/consultancy/dashboard?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:5173/signin',
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

    async handleCheckoutCompleted(session) {
        const customerId = session?.customer;
        const subscriptionId = session?.subscription;
        if (!customerId || !subscriptionId) return { ok: true, info: 'missing customer/subscription' };

        const { planKey } = await getPlanFromSubscriptionId(subscriptionId);
        if (!planKey) return { ok: true, info: 'plan not resolved from price' };

        const consultancy = await findConsultancyByCustomer(customerId);
        if (!consultancy) return { ok: true, info: 'consultancy not found for customer' };

        await setConsultancySubscription(consultancy._id, 'active', planKey, customerId);
        await ensureUsageRow(consultancy._id, planKey);

        return { ok: true, plan: planKey };
    },

    async handleSubscriptionCreated(subscription) {
        const customerId = subscription?.customer;
        const priceId = subscription?.items?.data?.[0]?.price?.id;
        const planKey = priceIdToPlan(priceId);

        const consultancy = await findConsultancyByCustomer(customerId);
        if (!consultancy) return { ok: true, info: 'consultancy not found' };

        if (planKey) {
        await setConsultancySubscription(consultancy._id, 'active', planKey, customerId);
        await ensureUsageRow(consultancy._id, planKey);
        }
        return { ok: true, plan: planKey || consultancy.subscription_plan };
    },

    async handleSubscriptionUpdated(subscription) {
        const customerId = subscription?.customer;
        const priceId = subscription?.items?.data?.[0]?.price?.id;
        const planKey = priceIdToPlan(priceId);
        const status = subscription?.status; 
        const mappedStatus = (status === 'active' || status === 'trialing') ? 'active' : 'inactive';

        const consultancy = await findConsultancyByCustomer(customerId);
        if (!consultancy) return { ok: true, info: 'consultancy not found' };

        await setConsultancySubscription(
            consultancy._id,
            mappedStatus,
            planKey || consultancy.subscription_plan,
            customerId
        );
        if (planKey) await ensureUsageRow(consultancy._id, planKey);

        return { ok: true, plan: planKey || consultancy.subscription_plan, status: mappedStatus };
    },

    async handleSubscriptionDeleted(subscription) {
        const customerId = subscription?.customer;
        const consultancy = await findConsultancyByCustomer(customerId);
        if (!consultancy) return { ok: true, info: 'consultancy not found' };

        await setConsultancySubscription(consultancy._id, 'inactive', null, customerId);
        return { ok: true, status: 'inactive' };
    },

    async handleInvoicePaid(invoice) {
        const customerId = invoice?.customer;
        const consultancy = await findConsultancyByCustomer(customerId);
        if (!consultancy) return { ok: true, info: 'consultancy not found' };

        await setConsultancySubscription(consultancy._id, 'active', consultancy.subscription_plan, customerId);
        return { ok: true };
    },

    async handleInvoicePaymentFailed(invoice) {
        const customerId = invoice?.customer;
        const consultancy = await findConsultancyByCustomer(customerId);
        if (!consultancy) return { ok: true, info: 'consultancy not found' };

        await setConsultancySubscription(consultancy._id, 'inactive', null, customerId);
        return { ok: true, status: 'inactive' };
    },
}
