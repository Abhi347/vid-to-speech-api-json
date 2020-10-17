function downloadFile(file, fileName) {
    console.log('Download started for ' + fileName);
    return new Promise((resolve, reject) => {
        let destination = '/tmp/' + fileName;
        file.download({
            destination: destination
        }).then((error) => {
            console.log('Download is done ' + error);
            if (error.length > 0) {
                reject(error);
            } else {
                resolve(destination);
            }
        });
    });
}

module.exports = {
    downloadFile: downloadFile
};