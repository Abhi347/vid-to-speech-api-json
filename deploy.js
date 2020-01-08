const { spawn } = require('child_process');
const appConfig = require('./app-config');
const deployParams = [];
const params = [
    'functions',
    'deploy'
];
for (let cloudFunction in appConfig.functions) {
    const triggerEvent = appConfig.functions[cloudFunction].trigger.event;
    const resourceName = appConfig.functions[cloudFunction].trigger.resource;
    if (triggerEvent === 'storage') {
        let command = [
            ...params,
            cloudFunction,
            '--trigger-resource',
            appConfig.buckets[resourceName],
            '--trigger-event',
            'google.storage.object.finalize',
            '--runtime',
            'nodejs10'
        ];
        deployParams.push(command);
    } else if (triggerEvent === 'http') {
        let command = [
            ...params,
            cloudFunction,
            '--trigger-http'
        ];
        deployParams.push(command);
    }
    else {
        //stub for other triggers
    }
}

function deploy() {
    if (deployParams.length < 1) {
        return;
    }
    const deployParam = deployParams.shift();
    console.log(`gcloud ${deployParam.join(' ')}`);
    spawn('gcloud', deployParam, {
        stdio: 'inherit',
        shell: true
    }).on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        deploy();
    });
}

deploy();

