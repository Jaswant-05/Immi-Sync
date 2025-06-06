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
    url : {
        type : String,
        required : true
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
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;