const path = require('path');
const storageClient = require('@google-cloud/storage')();
const appConfig = require('../app-config');

const videoBucket = storageClient.bucket(appConfig.buckets.video);
const flacBucket = storageClient.bucket(appConfig.buckets.audio);
const outputBucket = storageClient.bucket(appConfig.buckets.speechResponse);
const srtBucket = storageClient.bucket(appConfig.buckets.srtResponse);

function getFilePathFromFile(storageFile) {
    return `gs://${storageFile.bucket.name}/${storageFile.name}`;
}

function downloadFile(file, fileName) {
    console.log('Download started for ' + fileName);
    let sourcePath = path.parse(fileName);
    return new Promise((resolve, reject) => {
        let tempDestination = '/tmp/' + fileName;
        file.download({
            destination: tempDestination
        }).then((error) => {
            console.log('Download is done ' + error);
            if (error.length > 0) {
                reject(error);
            } else {
                resolve({
                    source: {
                        name: sourcePath.name,
                        ext: sourcePath.ext
                    },
                    destination: { temp: { video: tempDestination } }
                });
            }
        });
    });
}

function uploadToBucket(bucket, filepath) {
    return bucket
        .upload(filepath)
        .then(() => {
            console.log(`${filepath} uploaded to bucket.`);
            return Promise.resolve('resolve');
        })
        .catch(err => {
            console.error('ERROR:', err);
            return Promise.reject(err);
        });
}

// function uploadVideo(filepath) {
//     uploadToBucket(videoBucket, filepath);
// }
function uploadFlac(filepath) {
    return uploadToBucket(flacBucket, filepath);
}

function uploadJsonOutput(filepath) {
    return uploadToBucket(outputBucket, filepath);
}

function uploadSRTOutput(filepath) {
    return uploadToBucket(srtBucket, filepath);
}

module.exports = {
    videoBucket: videoBucket,
    flacBucket: flacBucket,
    outputBucket: outputBucket,
    getFilePathFromFile: getFilePathFromFile,
    downloadFile: downloadFile,
    uploadFlac: uploadFlac,
    uploadJsonOutput: uploadJsonOutput
};