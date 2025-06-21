const Checklist = require('../models/Checklist');
const Document = require('../models/Document');
const Task = require('../models/Task');
const documentService = require('./documentService');
const taskService = require('./taskService');

const checklistService = {
  async createChecklist({ consultancyId, userId = null, application = null  }) { 
    try {
      const newChecklist = await Checklist.create({
        consultancy: consultancyId,
        user: userId,
        application
      });

      return { success: true, checklist: newChecklist };
    } catch (err) {
      throw new Error(`Error creating Checklist: ${err.message}`);
    }
  },

  async addDocument({ checklistId, documentId }) {
    try {
      const checklist = await Checklist.findById(checklistId);
      if (!checklist) return { success: false, message: "Checklist not found" };

      if (!checklist.documents.includes(documentId)) {
        checklist.documents.push(documentId);
        checklist.updatedAt = new Date();
        await checklist.save();
      }

      await documentService.updateDocument({ documentId, checklist: checklistId });

      return { success: true, checklist };
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

  async addTask({ checklistId, taskId }) {
    try {
      const checklist = await Checklist.findById(checklistId);
      if (!checklist) return { success: false, message: "Checklist not found" };

      if (!checklist.tasks.includes(taskId)) {
        checklist.tasks.push(taskId);
        checklist.updatedAt = new Date();
        await checklist.save();
      }

      await taskService.updateTask({ taskId, checklistId });

      return { success: true, checklist };
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

  async assignChecklist({ checklistId, userId, application }) {  
    try {
      const checklist = await Checklist.findById(checklistId);
      if (!checklist) return { success: false, message: "Checklist not found" };

      checklist.user = userId;
      checklist.application = application
      checklist.updatedAt = new Date();
      await checklist.save();

      return { success: true, checklist };
    } catch (err) {
      throw new Error(`Error assigning Checklist: ${err.message}`);
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
