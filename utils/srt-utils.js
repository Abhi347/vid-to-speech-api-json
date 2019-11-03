function convertGSTTToSRT(string) {
    const gstt = require('gstt-to-srt-converter')
    return gstt.convertGSTTToSRT(string);
}

module.exports = {
    convertGSTTToSRT: convertGSTTToSRT
};
