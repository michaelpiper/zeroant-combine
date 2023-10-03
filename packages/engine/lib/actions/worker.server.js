#!/usr/bin/env node
import { Command } from 'commander';
import { spawn } from 'child_process';
import loaders from 'zeroant-loader/index';
const program = new Command();
const workers = {};
const createWorker = (name) => {
    workers[name] = spawn('npm', ['run', 'worker', 'start', name], {
        cwd: process.cwd()
    });
    workers[name].stdout.on('data', (data) => {
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
program.name('worker').description('CLI to some Worker utilities').version('0.1.0');
program
    .command('dev')
    .argument('[worker]', 'Start worker')
    .action(async function (workerName) {
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
            return;
        }
        await worker.run();
    }
    else {
        console.log('Starting all Workers all process on one thread', zeroant.config.appName);
        await Promise.all(zeroant.getWorkers().map(async (worker) => {
            await worker.run();
        }));
    }
});
program
    .command('start')
    .argument('[worker]', 'Start worker')
    .action(async function (workerName) {
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
            return;
        }
        await worker.run();
    }
    else {
        console.log('Starting all Workers', zeroant.config.appName);
        for (const name of zeroant.getWorkerNames()) {
            console.log(name);
            createWorker(name);
            process.on('exit', (code) => {
                workers[name].kill(code);
            });
        }
    }
});
program.parse();
//# sourceMappingURL=worker.server.js.map