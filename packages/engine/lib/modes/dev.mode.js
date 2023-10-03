import getMode from './get-mode.js';
import { spawn } from 'child_process';
const dev = async (...args) => {
    const mode = await getMode(args.at(0));
    if (mode == null) {
        console.log('Unknown server type');
        return;
    }
    const child = spawn('npm', ['run', 'nodemon', `--exec "npm run serve ${args.join(' ')}"`], {
        cwd: process.cwd()
    });
    child.stdout.pipe(process.stdout);
    child.stdin.pipe(process.stdin);
    child.stderr.pipe(process.stderr);
    child.on('error', (args) => {
        process.emit('error', ...args);
    });
    child.on('close', (...args) => {
        process.emit('close', ...args);
    });
    process.on('exit', (...args) => {
        child.emit('exit', ...args);
    });
    process.on('message', (...args) => {
        child.emit('message', ...args);
    });
};
export default dev;
//# sourceMappingURL=dev.mode.js.map