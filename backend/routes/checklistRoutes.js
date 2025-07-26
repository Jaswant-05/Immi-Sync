const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/Auth');

const {
  createChecklist,
  getAllChecklists,
  addDocumentToChecklist,
  removeDocumentFromChecklist,
  addTaskToChecklist,
  removeTaskFromChecklist,
  assignChecklist,
  deleteChecklist,
  updateChecklist
} = require('../controllers/checklistController');

// POST /checklists — Create new checklist
router.post('/', authMiddleware, createChecklist);

// GET /checklists — Get all checklists with filters & pagination
router.get('/', authMiddleware, getAllChecklists);

// POST /checklists/:checklistId/documents — Add a document to checklist
router.post('/:checklistId/documents', authMiddleware, addDocumentToChecklist);

// DELETE /checklists/:checklistId/documents/:documentId — Remove document
router.delete('/:checklistId/documents/:documentId', authMiddleware, removeDocumentFromChecklist);

// POST /checklists/:checklistId/tasks — Add a task to checklist
router.post('/:checklistId/tasks', authMiddleware, addTaskToChecklist);

// DELETE /checklists/:checklistId/tasks/:taskId — Remove a task from checklist
router.delete('/:checklistId/tasks/:taskId', authMiddleware, removeTaskFromChecklist);

// POST /checklists/:checklistId/assign — Clone and assign checklist to an application
router.post('/:checklistId/assign', authMiddleware, assignChecklist);

//  PUT /checklists/:checklistId - Update checklist fields
router.put('/:checklistId', authMiddleware, updateChecklist);

// DELETE /checklists/:checklistId — Delete a checklist
router.delete('/:checklistId', authMiddleware, deleteChecklist);

module.exports = router;
