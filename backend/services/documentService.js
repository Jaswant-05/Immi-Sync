const Application = require("../models/Application");
const Checklist = require("../models/Checklist");
const Document = require("../models/Document");
const { deleteFileFromGCS } = require("./gcsService");

const documentService = {
    async createDocument(payload){
        try {
            const {
                user,
                consultancy,
                name,
                gcs_file_name,  
                url,   
                uploaded = false,
                checklist ,
                application    
            } = payload;

            const newDoc = await Document.create({
                user,
                consultancy,
                name,
                gcs_file_name,
                url,
                uploaded,
                checklist,
                application
            });

            if (application) {
                await Application.findByIdAndUpdate(application, {
                    $addToSet: { documents: newDoc._id }
                });
            }

            if(checklist){
                 await Checklist.findByIdAndUpdate(checklist, {
                    $addToSet: { documents: newDoc._id }
                });
            }

            return { success: true, document: newDoc };

        } catch (err) {
            throw new Error(`Error creating Document: ${err.message}`);
        }
    },
    async updateDocument(payload) {
        try {
            const { documentId, ...updates } = payload;

            const document = await Document.findOne({ _id: documentId });
            if (!document) {
                return { success: false, message: "Document not found" };
            }

            Object.keys(updates).forEach(key => {
                if (document[key] !== undefined) {
                    document[key] = updates[key];
                }
            });

            await document.save();
            return { success: true, document };

        }catch (err) {
            throw new Error(`Error updating Document: ${err.message}`);
        }
    },
    async getDocument(documentId){
        try{
            const document = await Document.findOne({_id : documentId});
            if (document) {
                return { success: true, document };
            } else {
                return { success: false, message: "Document not found" };
            }
        } catch(err){
            throw new Error(`Error fetching Document ${err.message}`);
        }
    },      
    async deleteDocument(documentId){
        try{
            const document = await Document.findOne({_id : documentId});
            if(document.uploaded){
                const result = await deleteFileFromGCS(document.gcs_file_name);
                if (!result.success){
                    throw new Error(`error Deleting file from GCS`);
                }
            }

            if (document.application) {
                await Application.findByIdAndUpdate(document.application, {
                    $pull: { documents: document._id }
                });
            }

            if (document.checklist) {
                await Checklist.findByIdAndUpdate(document.checklist, {
                    $pull: { documents: document._id }
                });
            }

            await Document.deleteOne({_id : document._id});
            return ({success: true, message: "Successfully deleted Document"})

        } catch(err){
            throw new Error(`Error deleting Document: ${err.message}`);
        }
    },
};

module.exports = documentService;