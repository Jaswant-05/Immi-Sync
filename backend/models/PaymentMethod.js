const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    consultancy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultancy'
    },
    payment_method_id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    card_last_4 : {
        type: number,
    },
    card_expiry_date : {
        type: Date,
        required: true
    },
    is_default : {
        type: Boolean,
        required: true
    },
    createdAt : { 
        type: Date,
        required: true,
        default : Date.now()
    },
    updatedAt : {
        type: Date,
        default: Date.now()
    },
})

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;