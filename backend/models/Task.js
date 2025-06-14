const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false
    },
    consultancy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Consultancy',
        required : true
    },
    title : {
        type : String,  
        required : true
    },
    description : {
        type : String,
        required : true
    },
    isDone : {
        type : Boolean,
        required : true,
    },
    checklist : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checklist",
        required: false
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        required : true
    },
    updatedAt : {
        type: Date,
        required: false
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;