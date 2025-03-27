require('dotenv').config();
const multer = require('multer');
const streamifier = require('streamifier');
const { Storage } = require('@google-cloud/storage');

// Multer setup 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Google Cloud Storage setup
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const fileUpload = async (req, res) => {
    try {
      if (!req.file) return res.status(400).send('No file uploaded.');
  
      const filename = `${Date.now()}-${req.file.originalname}`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
        metadata: {
          contentType: req.file.mimetype,
        },
      });
  
      blobStream.on('error', (err) => {
        console.error('Upload error:', err);
        res.status(500).send('Upload failed.');
      });
  
      blobStream.on('finish', async () => {
        await blob.makePublic();
  
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ url: publicUrl });
      });
  
      // Pipe the buffer stream to GCS
      streamifier.createReadStream(req.file.buffer).pipe(blobStream);
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).send('Server error.');
    }
};

module.exports = fileUpload

