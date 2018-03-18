const speech = require('@google-cloud/speech');

const speechClient = new speech.SpeechClient();

function makeSpeechRequest(request) {
    console.log(`making request for ${JSON.stringify(request)}`);
    return new Promise((resolve, reject) => {
        speechClient.longRunningRecognize(request).then(function (responses) {
            var operation = responses[0];
            return operation.promise();
        }).then(function (responses) {
            resolve(responses[0]);
        }).catch(function (err) {
            reject(err);
        });
    });
}


module.exports = {
    makeSpeechRequest: makeSpeechRequest
};