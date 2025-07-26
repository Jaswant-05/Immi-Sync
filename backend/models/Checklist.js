const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
    consultancy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultancy',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: false
    },
    name : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    documents : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: false
    }],
    tasks : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
        required: false,
    }
})

const Checklist = mongoose.model('Checklist', checklistSchema);
module.exports = Checklist;