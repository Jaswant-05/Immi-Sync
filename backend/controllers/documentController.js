const DocumentService = require("../services/documentService");
const { uploadFileToGCS, deleteFileFromGCS } = require("../services/gcsService");
const User = require("../models/User");

const createDocument = async (req, res) => { 
  try {
    const userId = req.userId;
    console.log(userId);
    const { name, checklistId, application } = req.body;

    const user = await User.findById(userId);
    console.log(user);
    if (!user || !user.active_consultancy) {
      return res.status(404).json({ success: false, message: "User or active consultancy not found" });
    }

    let gcs_file_name = null;
    let url = null;
    let uploaded = false;

    if (req.file) {
      console.log("reached here");
      const filename = `${Date.now()}-${req.file.originalname}`;
      url = await uploadFileToGCS(req.file);
      gcs_file_name = filename;
      uploaded = true;
    }

    const payload = {
      name,
      user: userId,
      consultancy: user.active_consultancy,
      checklist: checklistId || null,
      application,
      gcs_file_name,
      url,
      uploaded
    };

    const result = await DocumentService.createDocument(payload);
    return res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const updates = req.body;

    if (req.file) {
      const newFilename = `${Date.now()}-${req.file.originalname}`;
      const newUrl = await uploadFileToGCS(req.file);

      const existing = await DocumentService.getDocument(documentId);
      if (existing.success && existing.document.uploaded) {
        await deleteFileFromGCS(existing.document.gcs_file_name);
      }

      updates.gcs_file_name = newFilename;
      updates.url = newUrl;
      updates.uploaded = true;
    }

    const result = await DocumentService.updateDocument({ documentId, ...updates });

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const result = await DocumentService.getDocument(documentId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const result = await DocumentService.deleteDocument(documentId);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createDocument,
  updateDocument,
  getDocument,
  deleteDocument,
};
