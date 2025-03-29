const express = require('express');
const router = express.Router();
const upload = require('../utils/multerUpload');
const { fileUpload, deleteFile } = require('../controllers/gcsController');

router.post('/upload', upload.single('file'), fileUpload);
router.delete('/delete', deleteFile);

module.exports = router;
