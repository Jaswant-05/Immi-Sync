const mongoose = require("mongoose");

const subscriptionUsageSchema = new mongoose.Schema({
    consultancy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Consultancy",
        required : true
    },
    plan : {
        type: String,
        enum : ["basic", "standard", "plus"],
        required : true
    },
    users : {
        type: Number,
        required : true,
        default : 1
    },
    applications : {
        type: Number,
        required: true,
        default : 0
    }
})

const SubscriptionUsage = mongoose.model("SubscriptionUsage", subscriptionUsageSchema);
module.exports = SubscriptionUsage