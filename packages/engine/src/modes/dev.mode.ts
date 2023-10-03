import { readFileSync } from 'fs'
import { availableType, defaultType } from './get-mode.js'
import nodemon from 'nodemon'
import commentjson from 'comment-json'
import { ABS_PATH } from 'zeroant-factory/config.factory'
const dev = async (...args: string[]) => {
  let script: string | null = null
  if (defaultType.includes(args.at(0) as never)) {
    script = 'npx zeroant serve'
  }
  if (availableType.includes(args.at(0) as never)) {
    script = `npx zeroant serve ${args.at(0) as string}`
  }
  if (script == null) {
    console.log('Unknown server type')
    process.exit()
  }
  const tsconfigString = readFileSync(ABS_PATH + '/tsconfig.json')?.toString()
  const tsconfig = commentjson.parse(tsconfigString ?? '{}') as any
  const outDir: string = tsconfig?.compilerOptions?.outDir ?? '.'
  nodemon({
    exec: script,
    cwd: process.cwd(),
    watch: [`${outDir}/**/*.js`],
    ignore: ['**/test/**', '**/docs/**'],
    delay: 300
  })
}
export default dev
