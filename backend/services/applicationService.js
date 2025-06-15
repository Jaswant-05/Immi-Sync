const Application = require("../models/Application");

const applicationService = {
    async createApplication(params) {
        try {
            const {
                user,
                consultancy,
                applicant_name,
                applicant_email,
                application_type,
                application_status,
                tasks = [],
                documents = []
            } = params;

            if (!user || !consultancy || !applicant_name || !applicant_email) {
                throw new Error("Missing required fields");
            }

            const newApplication = await Application.create({
                user,
                consultancy,
                applicant_name,
                applicant_email,
                application_type,
                application_status,
                tasks,
                documents
            });

            return { success: true, application: newApplication };
        } catch (err) {
            throw new Error(`Error Creating Application: ${err.message}`); 
        }
    },
    async getApplication(applicationId){
        try {
            if(!applicationId){
                throw new Error(`Missing Application Id`);
            }
            const application = await Application.findOne({ _id : applicationId});
            if(!application){
                throw new Error(`Error creating an application`);
            }
            return({success: true, application});
        } catch(err) {
            throw new Error(`Error Fetching Application ${err.message}`) 
        }
    },
    async updateApplication(applicationId, updateData) {
        try {
            if (!applicationId) {
                throw new Error("Missing Application Id");
            }

            const updated = await Application.findByIdAndUpdate(applicationId, updateData, {
                new: true,
                runValidators: true
            });

            if (!updated) {
                throw new Error("Application not found or not updated");
            }

            return { success: true, application: updated };
        } catch (err) {
            throw new Error(`Error Updating Application: ${err.message}`); 
        }
    },
    async deleteApplicatioin(applicationId){
        try {
            if(!applicationId){
                throw new Error(`Missing Application Id`);
            }
            await Application.deleteOne({_id : applicationId});
            return({success: true, message: "Application deleted successfully"});
        } catch(err) {
            throw new Error(`Error Deleting Application ${err.message}`) 
        }
    }
}

module.exports = applicationService;