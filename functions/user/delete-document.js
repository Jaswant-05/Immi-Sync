const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
const deleteOptions = {
  ifGenerationMatch: generationMatchPrecondition,
};

const deleteFile = async(fileName) => {
  await storage.bucket(bucket).file(fileName).delete(deleteOptions);
  console.log(`gs://${bucket}/${fileName} deleted`);
}

module.exports = deleteFile;

