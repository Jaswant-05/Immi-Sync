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
        const [signedUrl] = await blob.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60, 
        });

        resolve(signedUrl);
      } catch (err) {
        reject(err);
      }
    });

    streamifier.createReadStream(file.buffer).pipe(blobStream);
  });
};

const deleteFileFromGCS = async (fileName) => {
  try{
    await bucket.file(fileName).delete();
    console.log(`gs://${bucket.name}/${fileName} deleted`);
    return({success: true, message: "File deleted from gcs"});
  } catch(err){
    throw new Error(`Error deleting from GCS ${err.message}`);
  }
 
};

module.exports = {
  uploadFileToGCS,
  deleteFileFromGCS,
};
