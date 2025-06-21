const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middleware/Auth");
const upload = require('../utils/multerUpload');
const {
  createApplication,
  getApplication,
  getAllApplications,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');

// POST /applications — Create new application (with optional documents)
router.post('/', upload.array('documents', 10), authMiddleware, createApplication);

// GET /applications — Get all applications with filters and pagination
router.get('/', authMiddleware, getAllApplications);

// GET /applications/:applicationId — Fetch specific application details
router.get('/:applicationId', authMiddleware, getApplication);

// PUT /applications/:applicationId — Update application (with optional document uploads)
router.put('/:applicationId', upload.array('documents', 10), authMiddleware, updateApplication);

// DELETE /applications/:applicationId — Delete application
router.delete('/:applicationId', authMiddleware, deleteApplication);

module.exports = router;