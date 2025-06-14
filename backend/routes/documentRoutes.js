const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middleware/Auth");
const upload = require('../utils/multerUpload'); 
const {
  createDocument,
  updateDocument,
  getDocument,
  deleteDocument
} = require('../controllers/documentController');

// POST /documents — Create new document (with optional file)
router.post('/', upload.single('file'), authMiddleware ,createDocument);

// PUT /documents/:documentId — Update document (optional file replace)
router.put('/:documentId', upload.single('file'), authMiddleware ,updateDocument);

// GET /documents/:documentId — Fetch document details
router.get('/:documentId',authMiddleware , getDocument);

// DELETE /documents/:documentId — Delete document + file from GCS if uploaded
router.delete('/:documentId',authMiddleware , deleteDocument);

module.exports = router;
