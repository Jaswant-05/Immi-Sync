const mongoose = require('mongoose');

const consultancySchema = new mongoose.Schema({
    consultancyName : {
        type : String,
    },
    username : {
        type : String,
        required : true,
    },
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address'
    },
    phoneNumber : {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        enum : ['verified', 'unverified'],
        required : true,
    },
    
});

const Consultancy = mongoose.model('Consultancy', consultancySchema);

module.exports = Consultancy;