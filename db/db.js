 const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://sandhujaswant2005:aIGUPAcHCqKANTbx@cluster0.ycrzdkz.mongodb.net/IMMI");

const consultancySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    username : {
        type : String,
        required : true,
        unique  : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
    },
    phoneNumber : {
        type : Number,
        required : true
    },
    address : {
        type: String,
        required: true
    },
    subscriptionPlan : {
        type : String,
        enum : ['Free', 'Premium'],
       default : "Free" 
    },
    subscriptionStatus : {
        type : String,
        enum : ['Active' , 'Cancelled']
    },
    dateOfRegistration: {
        type: Date,
        default: Date.now
      },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    paymentMethod: String
}); 

const userSchema = new mongoose.Schema({
    consultancyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Consultancy',
        required : true
    },
    username : {
        type : String,
        required : true,
        unique  : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
    },
    applicationStatus : {
        type : String,
        enum : ["Draft", "Filed", "Decision"],
        required : true
    },
    applicationCreateDate : {
        type : Date,
        default : Date.now
    },
    applicationFileDate : {
        type : Date
    },
    applicationType : {
        type : String,
        enum : ["Visitor", "Student", "Work", "PR"],
        required : true
    }
});     

const documentSchema = new mongoose.Schema({
    consultancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultancy',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    link: { type: String, required: true }
});

const taskSchema = new mongoose.Schema({
    consultancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultancy',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isDone: { type: Boolean, default: false }
});

const paymentHistorySchema = new mongoose.Schema({
    consultancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultancy',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    method: String,
    transactionId: String
});