import getMode from './get-mode.js'
import { spawn } from 'child_process'
const dev = async (...args: string[]) => {
  const mode = await getMode(args.at(0))
  if (mode == null) {
    console.log('Unknown server type')
    return
  }
  const child = spawn('npm', ['run', 'nodemon', `--exec="npm run zeroant serve ${args.join(' ')}"`], {
    cwd: process.cwd()
  })
  child.stdout.pipe(process.stdout)
  child.stdin.pipe(process.stdin)
  child.stderr.pipe(process.stderr)

  child.on('error', (args: any[]) => {
    process.emit('error' as any, ...args)
  })
  child.on('close', (...args: any[]) => {
    process.emit('close' as any, ...args)
  })

  process.on('exit', (...args: any[]) => {
    child.emit('exit', ...args)
  })
  process.on('message', (...args: any[]) => {
    child.emit('message', ...args)
  })
}
export default dev
