import { availableType, defaultType } from './get-mode.js';
import nodemon from 'nodemon';
const dev = async (...args) => {
    let script = null;
    if (defaultType.includes(args.at(0))) {
        script = 'npx zeroant serve';
    }
    if (availableType.includes(args.at(0))) {
        script = `npx zeroant serve ${args.at(0)}`;
    }
    if (script == null) {
        console.log('Unknown server type');
        process.exit();
    }
    nodemon({
        script: `npx zeroant serve`,
        cwd: process.cwd(),
        watch: ['application/**/*.js'],
        ignore: ['**/test/**', '**/docs/**'],
        delay: 300
    });
};
export default dev;
//# sourceMappingURL=dev.mode.js.map