#!/usr/bin/env node

import { spawn } from 'child_process'
import type * as events from 'events'
import { type SERVER_MODE } from 'zeroant-factory/config.factory'
import loaders from 'zeroant-loader'
const workers: Record<string, any & events.EventEmitter> = {}
const createWorker = (name: string) => {
  workers[name] = spawn('npx', ['zeroant', 'worker', name], {
    cwd: process.cwd()
  })
  workers[name].stdout.pipe('data', (data: string) => {
    console.log(`[worker ${name} info]: ${data}`)
  })
  workers[name].stderr.on('data', (data: string) => {
    console.log(`[worker ${name} err]: ${data}`)
  })
  workers[name].on('error', (error: Error) => {
    console.log(`[worker ${name} error]: ${error.message}`)
  })
  workers[name].on('close', (code: number) => {
    console.log(`[worker ${name} exit]: child process exited with code ${code}`)
    workers[name] = createWorker(name)
  })
  return workers[name]
}
// Worker
const combine = async function (workerName?: string) {
  const SERVER_MODE: SERVER_MODE = 'standalone'
  const SERVER_APP = 'worker'
  const zeroant = await loaders({
    SERVER_MODE,
    SERVER_APP
  })
  if (workerName !== null && workerName !== undefined && workerName.length > 0) {
    console.log('Start Worker', workerName)
    const worker = zeroant.getWorkerByName(workerName)
    if (worker === undefined || worker === null) {
      console.log('Worker Not Found', workerName)
      process.exit()
    }
    await worker.run()
  } else {
    console.log('Starting all Workers In Combine Mode', zeroant.config.appName)
    await Promise.all(
      zeroant.getWorkers().map(async (worker) => {
        await worker.run()
      })
    )
  }
}
const split = async function () {
  const SERVER_MODE: SERVER_MODE = 'standalone'
  const SERVER_APP = 'worker'
  const zeroant = await loaders({
    SERVER_MODE,
    SERVER_APP
  })

  console.log('Starting all Workers In Split Mode', zeroant.config.appName)
  for (const name of zeroant.getWorkerNames()) {
    console.log(name)
    createWorker(name)
    process.on('exit', (code: number) => {
      workers[name].kill(code)
    })
    // .on('SIGINT', (code: number) => {
    //   process.exit(code)
    // })
  }
}
export default async (workerName?: any) => {
  if (workerName === 'split') {
    await split()
  } else {
    await combine(workerName)
  }
}
