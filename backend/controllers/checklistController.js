const Consultancy = require("../models/Consultancy");
const checklistService = require("../services/checklistService");

const createChecklist = async (req, res) => {
  try {
    const userId = req.userId;
    const consultancy = await Consultancy.findOne({admin : userId});
    const { application, name, description } = req.body;

    const payload = {
      consultancyId: consultancy._id,
      userId,
      application,
      name,
      description
    };

    const result = await checklistService.createChecklist(payload);
    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllChecklists = async (req, res) => {
  try {

    const userId = req.userId
    const consultancy = await Consultancy.findOne({admin : userId});

    const {
      application,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const filters = {
      consultancy: consultancy._id,
      application,
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    };

    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const result = await checklistService.getAllChecklists({ filters });
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addDocumentToChecklist = async (req, res) => {
  try {
    const userId = req.userId;
    const consultancy = await Consultancy.findOne({admin : userId});
    const { checklistId } = req.params;
    const { documentId, name } = req.body;

    const result = await checklistService.addDocument({ checklistId, documentId, user: userId, consultancy: consultancy._id , name});

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeDocumentFromChecklist = async (req, res) => {
  try {
    const { checklistId, documentId } = req.params;
    console.log("Reached here");
    console.log(checklistId, documentId);
    const result = await checklistService.removeDocument({ checklistId, documentId });
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addTaskToChecklist = async (req, res) => {
  try {
    const userId = req.userId;
    const consultancy = await Consultancy.findOne({admin : userId});
    const { checklistId } = req.params;
    const { taskId, title, description} = req.body;

    const result = await checklistService.addTask({ checklistId, taskId, title, description, isDone : false, user : userId, consultancy: consultancy._id});
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeTaskFromChecklist = async (req, res) => {
  try {
    const { checklistId, taskId } = req.params;

    const result = await checklistService.removeTask({ checklistId, taskId });
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const assignChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const { application } = req.body;

    const result = await checklistService.assignChecklist({ checklistId, application });
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateChecklist = async (req, res) => {
  try {

    const { checklistId } = req.params;
    const updateData = req.body;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await checklistService.updateChecklist({ checklistId, updateData });
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const result = await checklistService.deleteChecklist({ checklistId });
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createChecklist,
  getAllChecklists,
  addDocumentToChecklist,
  removeDocumentFromChecklist,
  addTaskToChecklist,
  removeTaskFromChecklist,
  assignChecklist,
  updateChecklist,
  deleteChecklist
};