const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

function extractAudio(fileinfo) {
    let tempAudioPath = '/tmp/' + fileinfo.source.name + '.flac';
    fileinfo.destination.temp.audio = tempAudioPath;
    return new Promise((resolve, reject) => {
        ffmpeg(fileinfo.destination.temp.video)
            .videoBitrate(19200)
            .inputOptions('-vn')
            .format('flac')
            .audioChannels(1)
            .output(tempAudioPath)
            .on('end', function () {
                console.log('extracted audio');
                resolve(fileinfo);
            })
            .on('error', function (err, stdout, stderr) {
                reject(err);
            })
            .run();
    });
}

module.exports = {
    extractAudio: extractAudio
};