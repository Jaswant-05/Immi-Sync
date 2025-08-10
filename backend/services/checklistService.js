const Application = require('../models/Application');
const Checklist = require('../models/Checklist');
const Document = require('../models/Document');
const Task = require('../models/Task');
const documentService = require('./documentService');
const taskService = require('./taskService');

const checklistService = {
  async createChecklist({ consultancyId, userId = null, application = null, name, description  }) { 
    try {
      const newChecklist = await Checklist.create({
        consultancy: consultancyId,
        user: userId,
        application,
        name,
        description
      });

      return { success: true, checklist: newChecklist };
    } catch (err) {
      throw new Error(`Error creating Checklist: ${err.message}`);
    }
  },

  async getAllChecklists({filters = {}}) {
    try{
      const {
        consultancy,
        application,
        page = 1,
        limit = 50,
        sort = { createdAt: -1}
      } = filters;

      const query = {};
      
      if(consultancy) query.consultancy = consultancy;
      if (application) {
        query.application = application;
      } else {
        query.application = null;
      }

      const skip = (page - 1) * limit;

      const checklists = await Checklist.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .populate('documents')
        .populate('tasks');

      const totalCount = await Checklist.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit)

      return {
        success : true,
        checklists,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }

    } catch (err){
      throw new Error(`Error Fetching Checklists: ${err.message}`);
    }
  },

  async addDocument({ checklistId, documentData, user, consultancy, name }) {
        try {
            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return { success: false, message: "Checklist not found" };
            }

            const documentPayload = {
                ...documentData,
                user,
                consultancy,
                name,
                checklist: checklistId,
                uploaded: false 
            };

            const createResult = await documentService.createDocument(documentPayload);

            if (!createResult.success) {
                return { success: false, message: "Failed to create document" };
            }

            const updatedChecklist = await Checklist.findById(checklistId).populate('documents');

            return { 
                success: true, 
                document: createResult.document,
                checklist: updatedChecklist 
            };

        } catch (err) {
            throw new Error(`Error adding Document to Checklist: ${err.message}`);
        }
    },

  async removeDocument({ checklistId, documentId }) {
    try {
      const checklist = await Checklist.findById(checklistId);
      if (!checklist) return { success: false, message: "Checklist not found" };

      checklist.documents = checklist.documents.filter(
        id => id.toString() !== documentId
      );
      checklist.updatedAt = new Date();
      await checklist.save();

      await documentService.updateDocument({ documentId, checklist: null });

      return { success: true, checklist };
    } catch (err) {
      throw new Error(`Error removing Document from Checklist: ${err.message}`);
    }
  },

  async addTask({ checklistId, title, description, user, consultancy, isDone }) {
        try {
            
            const checklist = await Checklist.findById(checklistId);
            if (!checklist) {
                return { success: false, message: "Checklist not found" };
            }

            const taskPayload = {
                title,
                description,
                user,
                consultancy,
                isDone,
                checklist: checklist._id, 
            };

            const createResult = await taskService.createTask(taskPayload);
            
            if (!createResult.success) {
                return { success: false, message: "Failed to create task" };
            }

            const updatedChecklist = await Checklist.findById(checklistId).populate('tasks');

            return { 
                success: true, 
                task: createResult.task,
                checklist: updatedChecklist 
            };

        } catch (err) {
            throw new Error(`Error adding Task to Checklist: ${err.message}`);
        }
  },

  
  async removeTask({ checklistId, taskId }) {
    try {
      const checklist = await Checklist.findById(checklistId);
      if (!checklist) return { success: false, message: "Checklist not found" };

      checklist.tasks = checklist.tasks.filter(
        id => id.toString() !== taskId
      );
      checklist.updatedAt = new Date();
      await checklist.save();

      await taskService.updateTask({ taskId, checklistId: null });

      return { success: true, checklist };
    } catch (err) {
      throw new Error(`Error removing Task from Checklist: ${err.message}`);
    }
  },

  async assignChecklist({ checklistId, application }) {
    try {
        const templateChecklist = await Checklist.findById(checklistId)
            .populate('documents')
            .populate('tasks')
            .lean();
            
        if (!templateChecklist) {
            return { success: false, message: "Checklist not found" };
        }

        if (templateChecklist.application) {
            return { success: false, message: "Cannot assign an already assigned checklist" };
        }

        const applicationDoc = await Application.findById(application).lean();
        if (!applicationDoc) {
            return { success: false, message: "Application not found" };
        }

        const newDocuments = [];
        if (templateChecklist.documents && templateChecklist.documents.length > 0) {
            for (const doc of templateChecklist.documents) {
                const newDoc = await Document.create({
                    user: applicationDoc.user,
                    consultancy: doc.consultancy,
                    name: doc.name,
                    gcs_file_name: null,
                    url: null,
                    uploaded: false,
                    application: application,
                });
                newDocuments.push(newDoc._id);
            }
        }

        const newTasks = [];
        if (templateChecklist.tasks && templateChecklist.tasks.length > 0) {
            for (const task of templateChecklist.tasks) {
                const newTask = await Task.create({
                    title: task.title,
                    description: task.description,
                    consultancy: task.consultancy,
                    user: applicationDoc.user,
                    application: application,
                    checklist: null, 
                    isDone: false,
                    updatedAt: new Date()
                });
                newTasks.push(newTask._id);
            }
        }

        const newChecklist = await Checklist.create({
            consultancy: templateChecklist.consultancy,
            user: applicationDoc.user,
            application: application, 
            name: templateChecklist.name,
            description: templateChecklist.description,
            documents: newDocuments,
            tasks: newTasks,
            updatedAt: new Date()
        });

        if (newDocuments.length > 0) {
            await Document.updateMany(
                { _id: { $in: newDocuments } },
                { checklist: newChecklist._id }
            );
        }

        if (newTasks.length > 0) {
            await Task.updateMany(
                { _id: { $in: newTasks } },
                { checklist: newChecklist._id }
            );
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            application, 
            { checklist: newChecklist._id },
            { new: true }
        );

        return { 
            success: true, 
            checklist: newChecklist, 
            application: updatedApplication 
        };

    } catch (err) {
        throw new Error(`Error assigning Checklist: ${err.message}`);
    }
  },

  async updateChecklist({ checklistId, updateData}){
    try{

      if(!checklistId){
        throw new Error("No checklist ID found in updateChecklist Service")
      }

      const updated = await Checklist.findByIdAndUpdate(checklistId, updateData);

      if(!updated){
        throw new Error("Error updating checklist")
      }

      return({success : true, updated});

    } catch (err) {
      throw new Error(`Error Updating Checklist: ${err.message}`)
    }
  },

  async deleteChecklist({ checklistId }) {
    try {
      const checklist = await Checklist.findById(checklistId);
      if (!checklist) return { success: false, message: "Checklist not found" };

      await Document.updateMany({ checklist: checklistId }, { $unset: { checklist: "" } });
      await Task.updateMany({ checklist: checklistId }, { $unset: { checklist: "" } });
      await Checklist.deleteOne({ _id: checklistId });

      return { success: true, message: "Checklist and references removed" };
    } catch (err) {
      throw new Error(`Error deleting Checklist: ${err.message}`);
    }
  }
};

module.exports = checklistService;
