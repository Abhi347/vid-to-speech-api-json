//gcloud beta functions deploy extractAudio --trigger-resource cf-test-videos --trigger-event google.storage.object.finalize
//gcloud beta functions deploy transcribeAudio --trigger-resource cf-test-flac-audio --trigger-event google.storage.object.finalize
const extractAudio = require('./functions/extractAudio');
const transcribeAudio = require('./functions/transcribeAudio');

exports.extractAudio = extractAudio;
exports.transcribeAudio = transcribeAudio;
