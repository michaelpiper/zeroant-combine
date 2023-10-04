#!/usr/bin/env node
import { spawn } from 'child_process';
import loaders from 'zeroant-loader/index';
const workers = {};
const createWorker = (name) => {
    workers[name] = spawn('npx', ['zeroant', 'worker', name], {
        cwd: process.cwd()
    });
    workers[name].stdout.pipe('data', (data) => {
        console.log(`[worker ${name} info]: ${data}`);
    });
    workers[name].stderr.on('data', (data) => {
        console.log(`[worker ${name} err]: ${data}`);
    });
    workers[name].on('error', (error) => {
        console.log(`[worker ${name} error]: ${error.message}`);
    });
    workers[name].on('close', (code) => {
        console.log(`[worker ${name} exit]: child process exited with code ${code}`);
        workers[name] = createWorker(name);
    });
    return workers[name];
};
const combine = async function (workerName) {
    const SERVER_MODE = 'standalone';
    const SERVER_APP = 'worker';
    const zeroant = await loaders({
        SERVER_MODE,
        SERVER_APP
    });
    if (workerName !== null && workerName !== undefined && workerName.length > 0) {
        console.log('Start Worker', workerName);
        const worker = zeroant.getWorkerByName(workerName);
        if (worker === undefined || worker === null) {
            console.log('Worker Not Found', workerName);
            process.exit();
        }
        await worker.run();
    }
    else {
        console.log('Starting all Workers In Combine Mode', zeroant.config.appName);
        await Promise.all(zeroant.getWorkers().map(async (worker) => {
            await worker.run();
        }));
    }
};
const split = async function () {
    const SERVER_MODE = 'standalone';
    const SERVER_APP = 'worker';
    const zeroant = await loaders({
        SERVER_MODE,
        SERVER_APP
    });
    console.log('Starting all Workers In Split Mode', zeroant.config.appName);
    for (const name of zeroant.getWorkerNames()) {
        console.log(name);
        createWorker(name);
        process.on('exit', (code) => {
            workers[name].kill(code);
        });
    }
};
export default async (workerName) => {
    if (workerName === 'split') {
        await split();
    }
    else {
        await combine(workerName);
    }
};
//# sourceMappingURL=worker.server.js.map