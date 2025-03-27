const mongoose = require('mongoose');

const consultancySchema = new mongoose.Schema({
    name : {
        type : String,
    },
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address',
        required : false
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