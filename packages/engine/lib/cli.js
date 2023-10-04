#!/usr/bin/env node
import { Command } from 'commander';
import dev from './modes/dev.mode.js';
import serve from './modes/serve.mode.js';
import init from './scripts/init.script.js';
import { ABS_PATH } from 'zeroant-factory/config.factory';
import path from 'path';
import { readFileSync } from 'fs';
import commentjson from 'comment-json';
const program = new Command();
const createAction = (action) => async (...args) => {
    const { zeroant } = await import('zeroant-loader/index');
    const tsconfigString = readFileSync(ABS_PATH + '/tsconfig.json')?.toString();
    const tsconfig = commentjson.parse(tsconfigString ?? '{}');
    const { registry } = await import(path.join(ABS_PATH, tsconfig?.compilerOptions?.outDir ?? '', '/registry.js'));
    zeroant.bootstrap(registry);
    return await action(...args);
};
program.name('zeroant').description('CLI to some ZeroAnt utilities').version('0.1.0');
program.command('init').argument('[action]', 'Init').action(createAction(init));
program.command('dev').argument('[action]', 'Dev').argument('[options]', 'Dev Options').action(dev);
program.command('serve').argument('[action]', 'Serve').argument('[options]', 'Serve Options').action(createAction(serve));
program
    .command('worker')
    .argument('[name]', 'Worker Name')
    .action(createAction(async (...args) => serve('worker', ...args)));
program.parse();
//# sourceMappingURL=cli.js.map