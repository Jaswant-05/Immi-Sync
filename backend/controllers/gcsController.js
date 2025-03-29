const { uploadFileToGCS, deleteFileFromGCS } = require('../services/gcsService');

const fileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const url = await uploadFileToGCS(req.file);
    return res.status(200).json({ url });
  } catch (err) {
    console.error('File upload controller error:', err);
    return res.status(500).json({ message: 'Upload failed.' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileName } = req.body;
    if (!fileName) {
      return res.status(400).json({ message: 'Missing fileName in request body.' });
    }

    await deleteFileFromGCS(fileName);
    return res.status(200).json({ message: 'File deleted successfully.' });
  } catch (err) {
    console.error('Delete file error:', err);
    return res.status(500).json({ message: 'File deletion failed.' });
  }
};

module.exports = {
  fileUpload,
  deleteFile,
};
