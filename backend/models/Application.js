const mongoose = require('mongoose');
const Task = require('./Task');
const Checklist = require('./Checklist');
const { deleteFileFromGCS } = require('../services/gcsService');
const Document = require('./Document');

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
    checklist : {
      type:  mongoose.Schema.Types.ObjectId,
      ref : 'Checklist',
      required : false
    },
    createdAt : {
        type: Date,
        default: Date.now(),
        required : true
    },
    updatedAt : {
        type: Date,
        default: Date.now(),
        required: true
    }
});

applicationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const applicationId = this._id;

    const documents = await Document.find({ application: applicationId });
    for (const doc of documents) {
      if (doc.uploaded && doc.gcs_file_name) {
        try {
          await deleteFileFromGCS(doc.gcs_file_name);
        } catch (err) {
          console.warn(`Failed to delete GCS file ${doc.gcs_file_name}:`, err.message);
        }
      }
      await Document.deleteOne({ _id: doc._id });
    }

    await Task.deleteMany({ application: applicationId });
    await Checklist.deleteMany({ application: applicationId });

    next();
  } catch (err) {
    next(err);
  }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application