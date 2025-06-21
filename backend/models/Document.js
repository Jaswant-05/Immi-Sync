const mongoose = require('mongoose');


const documentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    consultancy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Consultancy',
        required : true
    },
    name : {
        type : String,
        required : true
    },
    gcs_file_name :{
        type : String,
        required : false
    },
    url : {
        type : String,
        required : false
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        required : true
    },
    uploaded : {
        type: Boolean,
        default: false,
        required: true
    },
    checklist : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checklist",
        required: false
    },
    application : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;