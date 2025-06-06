require('dotenv').config();
const streamifier = require('streamifier');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const uploadFileToGCS = (file) => {
  return new Promise((resolve, reject) => {
    const filename = `${Date.now()}-${file.originalname}`;
    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('GCS Upload Error:', err);
      reject(err);
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic(); 
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });

    streamifier.createReadStream(file.buffer).pipe(blobStream);
  });
};

const deleteFileFromGCS = async (fileName) => {
  await bucket.file(fileName).delete();
  console.log(`gs://${bucket.name}/${fileName} deleted`);
};

module.exports = {
  uploadFileToGCS,
  deleteFileFromGCS,
};
