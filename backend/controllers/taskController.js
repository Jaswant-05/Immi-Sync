const Consultancy = require("../models/Consultancy");
const User = require("../models/User");
const taskService = require("../services/taskService");

const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await taskService.getTask({ taskId });

    if (!result.task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, checklistId } = req.body;
    const user = await User.findOne({_id : userId});
    const consultancyId = user.active_consultancy;

    const result = await taskService.createTask({
      userId,
      consultancyId,
      title,
      description,
      checklistId,
    });

    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, isDone, checklistId } = req.body;

    const result = await taskService.updateTask({
      taskId,
      title,
      description,
      isDone,
      checklistId,
    });

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await taskService.deleteTask({ taskId });
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
