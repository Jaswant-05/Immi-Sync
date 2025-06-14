const express = require('express');
const { authMiddleware } = require("../middleware/Auth");
const router = express.Router();
const {
  createTask,
  updateTask,
  getTask,
  deleteTask
} = require('../controllers/taskController');

// POST /api/v1/tasks
router.post('/', authMiddleware, createTask);

// PUT /api/v1/tasks/:taskId
router.put('/:taskId', authMiddleware, updateTask);

// GET /api/v1/tasks/:taskId
router.get('/:taskId', authMiddleware, getTask);

// DELETE /api/v1/tasks/:taskId
router.delete('/:taskId', authMiddleware, deleteTask);

module.exports = router;
