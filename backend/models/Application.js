const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    consultancy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Consultancy',
        required : true,
    },
    tasks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Task',
        required : false,
    }],
    documents : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Document',
        required : false,
    }],
    applicant_name: {
        type: String,
        required: true
    },
    applicant_email: {
        type: String,
        required: true
    },
    application_type: {
        type: String,
        enum: ['Visitor', 'Work', 'PR', 'citizenship', 'other'],
    },
    application_status: {
        type: String,
        enum: ['Draft', 'Applied', 'Approved', 'Declined'],
    },
})

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application