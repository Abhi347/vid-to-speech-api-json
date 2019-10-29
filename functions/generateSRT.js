const fs = require('fs');
const path = require('path');
const storageUtils = require('../utils/storage-utils');
const srtUtils = require('../utils/srt-utils');
module.exports = (event) => {
    console.log(`event ${JSON.stringify(event)}`);
    let speechFileNameWithoutExtension;
    return Promise.resolve()
        .then(() => {
            console.log(`event.name: ${JSON.stringify(event.name)}`);
            const speechFile = storageUtils.outputBucket.file(event.name);
            const speechFilePath = storageUtils.getFilePathFromFile(speechFile);
            console.log(`speechFilePath: ${JSON.stringify(speechFilePath)}`);
            speechFileNameWithoutExtension = path.parse(speechFilePath).name;
            return storageUtils.downloadFile(speechFile, event.name);
        }).then((fileinfo) => {
            const speechData = '/tmp/' + fileinfo.source.name + '.json';
            const srtData = srtUtils.convertGSTTToSRT(speechData);
            const transcriptionFilePath = `/tmp/${speechFileNameWithoutExtension}.json`;
            console.log('result: ', srtData);
            //write transcriptions to local file
            return new Promise((resolve, reject) => {
                fs.writeFile(transcriptionFilePath, srtData, function (err) {
                    if (err) {
                        console.log(`Error in writing srt`);
                        reject(err);
                    } else {
                        console.log(`Write successful to ${transcriptionFilePath}`);
                        resolve(transcriptionFilePath);
                    }
                });
            });
        }).then((tempFile) => {
            //upload local transcription file to Cloud Storage
            console.log(`Uploading ${tempFile} to srt output bucket`);
            return storageUtils.uploadSRTOutput(tempFile);
        }).catch((err) => {
            return Promise.reject(err);
        });
};