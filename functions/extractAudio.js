const storageUtils = require('../utils/storage-utils');
const ffmpegUtils = require('../utils/ffmpeg-utils');
module.exports = (event) => {
    return Promise.resolve()
        .then(() => {
            const videoFile = storageUtils.videoBucket.file(event.data.name);
            console.log('downloading video file 2...');
            return storageUtils.downloadFile(videoFile, event.data.name);
        }).then((fileinfo) => {
            //extract audio and transcode to FLAC
            return ffmpegUtils.extractAudio(fileinfo);
        }).then((flacOutput) => {
            console.log(`Uploading ${flacOutput.destination.temp.audio} to flac bucket`);
            return storageUtils.uploadFlac(flacOutput.destination.temp.audio);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};