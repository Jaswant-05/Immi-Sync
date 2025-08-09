const Consultancy = require("../models/Consultancy");
const SubscriptionUsage = require("../models/subscriptionUsage");
const plans = require("../utils/plan");

const limit_checker = async(req, res, next) => {
    const userId = req.userId;

    const consultancy = await Consultancy.findOne({admin : userId}).lean();
    if (!consultancy) {
        return res.status(404).json({ message: "Consultancy not found" });
    }

    const plan = consultancy.subscription_plan;
    const subscription_usage = await SubscriptionUsage.findOne({consultancy : consultancy._id}).lean();
    if(!subscription_usage || !plan){
        return res.status(400).json({
            message : "No Active Subscription"
        })
    }

    if(subscription_usage.users >= plans[plan].user_limit){
        return res.status(403).json({
            message : "User limit exceeded"
        })
    }

    if(plans[plan].application_limit && (subscription_usage.applications >= plans[plan].application_limit)){
        return res.status(403).json({
            message : "Application limit exceeded"
        })
    }

    next()

}

module.exports = limit_checker;