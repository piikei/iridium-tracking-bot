const { Storage } = require('@google-cloud/storage');

const bucket = process.env.GOOGLE_BUCKET;
// Creates a client
const storage = new Storage();

async function updateGoogleFile(fileContent, destFileName) {

    await storage.bucket(bucket).file(destFileName).save(fileContent);

    console.log(`${destFileName} uploaded to ${bucket}`);

    // save().catch(console.error);

}

async function getGoogleFile(destFileName) {
    const googleFile = await storage.bucket(bucket).file(destFileName).download()

    return googleFile;
}

module.exports.updateGoogleFile = updateGoogleFile;
module.exports.getGoogleFile = getGoogleFile;