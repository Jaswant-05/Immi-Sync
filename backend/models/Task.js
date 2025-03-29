const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
    title : {
        type : String,  
        required : true
    },
    description : {
        type : String,
        required : true
    },
    isDone : {
        type : boolean,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        required : true
    },
    updatedAt : {
        type: Date,
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;