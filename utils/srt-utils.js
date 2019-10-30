function convertGSTTToSRT(string) {
    var obj = JSON.parse(string);
    var i = 1;
    var result = ''
    for (const line of obj.results) {
        result += i++;
        result += '\n'
        var word = line.alternatives[0].words[0]
        var time = convertSecondStringToRealtime(word.startTime);
        result += formatTime(time) + ' --> '

        var word = line.alternatives[0].words[line.alternatives[0].words.length - 1]
        time = convertSecondStringToRealtime(word.endTime);
        result += formatTime(time) + '\n'
        result += line.alternatives[0].transcript + '\n\n'
    }
    return result;
}

function formatTime(time) {
    return String(time.hours).padStart(2, '0')+ ':' + String(time.minutes).padStart(2, '0') + ':' + String(time.seconds).padStart(2, '0') + ',' +String(time.nanos).substr(0,3);
}

function convertSecondStringToRealtime(time) {
    var string = time.seconds
    var seconds = +string;
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor(seconds % 3600 / 60);
    seconds = Math.floor(seconds % 3600 % 60);
    return {
        hours, minutes, seconds, nanos: time.nanos
    }
}

module.exports = {
    convertGSTTToSRT: convertGSTTToSRT
};
