import { createServer, type Server } from 'http'
import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError'
import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum'
import { ZeroantEvent } from 'zeroant-constant'
import { type ServerFactoryConstructor, type ServerFactory } from './server.factory.js'
import { type ConfigFactory } from './config.factory.js'
import { type Plugin } from './plugin.factory.js'
import { EventEmitter } from 'events'
import { type WorkerFactoryConstructor, type WorkerFactory } from './worker.factory.js'
import { type AddonPlugin, type AddonPluginConstructor } from './addon.plugin.js'
import { type Logger } from 'winston'
import type RegistryFactory from 'registry.factory.js'
export class ZeroantContext<Config extends ConfigFactory> {
  static PORT = 8080
  static HOSTNAME = '127.0.0.1'
  protected _server: Server
  protected _port: number
  protected _hostname: string
  #state = 'idle'
  #store = new Map()
  #workers = new Map<string, WorkerFactory<any, any>>()
  #event = new EventEmitter()
  #registry: RegistryFactory
  _servers: ServerFactory[] = []
  constructor(private readonly Config: new (config: any) => Config) {}
  delay = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  initWorkers(workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>) {
    for (const Worker of workers) {
      const worker = new Worker(this)
      this.#workers.set(worker.name, worker)
    }
  }

  getWorkerByName<T extends WorkerFactory<any, any>>(workerName: string): T | undefined {
    return (this.#workers.get(workerName) as T) ?? null
  }

  getWorkerNames(): IterableIterator<string> {
    return this.#workers.keys()
  }

  get workers() {
    return {
      get: <T extends WorkerFactory<any, any>>(Worker: WorkerFactoryConstructor<T>) => this.getWorker<T>(Worker)
    }
  }

  getWorkers(): Array<WorkerFactory<any, any>> {
    const workers = []
    for (const worker of this.#workers.values()) {
      workers.push(worker)
    }
    return workers
  }

  getWorker<T extends WorkerFactory<any, any>>(Worker: WorkerFactoryConstructor<T>): T {
    for (const worker of this.#workers.values()) {
      if (worker instanceof Worker) {
        return worker
      }
    }
    throw new InternalServerError(
      ErrorCode.UNIMPLEMENTED_EXCEPTION,
      ErrorDescription.UNIMPLEMENTED_EXCEPTION,
      `Worker ${Worker.name} not registered check common/registry.ts for more information`
    )
  }

  listen(callback?: () => void): void {
    this.beforeStart()
    const config = this.getConfig()
    this._port = (config as ConfigFactory).serverPort ?? ZeroantContext.PORT
    this._hostname = (config as ConfigFactory).serverHostname ?? ZeroantContext.HOSTNAME
    const callbacks = this._servers.map((server) => server.callback())
    this._server = createServer((req, res): void => {
      void (async (req, res) => {
        for (const callback of callbacks) {
          await callback(req, res)
        }
      })(req, res)
    })
    this._server.listen(this._port, this._hostname, () => {
      this.onStart()
      if (typeof callback === 'function') {
        callback()
      }
    })
  }

  onStart() {
    this.#event.emit(ZeroantEvent.START)
    for (const plugin of this.plugin.values()) {
      plugin.onStart()
    }
    for (const server of this._servers) {
      server.onStart()
    }
    ;(this.config as ConfigFactory).logging('info', () => {
      console.info(new Date(), '[ZeroantContext]: Running On Port', this._port)
    })
  }

  beforeStart() {
    this.#event.emit(ZeroantEvent.BEFORE_START)
    for (const plugin of this.plugin.values()) {
      plugin.beforeStart()
    }
    for (const server of this._servers) {
      server.beforeStart()
    }
  }

  has(key: string) {
    return this.#store.has(key)
  }

  #exiting = false

  async safeExit(code?: number, signal?: NodeJS.Signals | 'exit' | 'beforeExit' | 'uncaughtException', ts?: number): Promise<void> {
    this.#state = 'exiting'
    if (this.#exiting) {
      return
    }
    this.#exiting = true
    if (signal !== undefined) console.info(new Date(), '[ZeroantContext]:', `Received ${signal}.`)
    await this.close(ts)
    process.exit(code)
  }

  async close(ts?: number) {
    this.#state = 'closing'
    this.#event.emit(ZeroantEvent.CLOSE)
    const wait: Array<Promise<any>> = []
    for (const plugin of this.plugin.values()) {
      wait.push(
        Promise.resolve().then(async () => {
          await plugin.close()
        })
      )
    }
    for (const server of this._servers) {
      wait.push(
        Promise.resolve().then(async () => {
          await server.close()
        })
      )
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this._server) {
      return
    }
    wait.push(
      new Promise<void>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!this._server) {
          resolve()
          return
        }
        this._server.close((err) => {
          if (err != null) {
            console.error(err.message)
          }
          resolve()
        })
      })
    )
    await Promise.all(wait)
    this.#state = 'closed'
    this.config.logging('info', () => {
      console.info(new Date(), '[ZeroantContext]: Stopped')
    })
    await this.delay(ts ?? 500)
  }

  bootstrap(registry: RegistryFactory) {
    if (this.hasRegistry) {
      throw new InternalServerError(
        ErrorCode.SERVER_EXCEPTION,
        ErrorDescription.SERVER_EXCEPTION,
        `${new Date().toISOString()} Registry already bootstrap for zeroant and it can't be overridden`
      )
    }
    this.#registry = registry
    registry.bootstrap(this)
    this.#event.emit(ZeroantEvent.BOOTSTRAP, this)
  }

  get hasRegistry() {
    return ![null, undefined].includes(this.#registry as never)
  }

  get registry(): RegistryFactory {
    if (!this.hasRegistry) {
      throw new InternalServerError(
        ErrorCode.SERVER_EXCEPTION,
        ErrorDescription.SERVER_EXCEPTION,
        `${new Date().toISOString()} Registry not register for zeroant yet, please bootstrap before using registry`
      )
    }
    return this.#registry
  }

  ready() {
    this.#event.emit(ZeroantEvent.READY, this)
    this.#registry.ready(this)
  }

  initServer(Server: ServerFactoryConstructor<ServerFactory>, registry: RegistryFactory) {
    const server = new Server(this)
    server.initialize(registry)
    this._servers.push(server)
    this.#store.set(`server:${Server.name}`, server)
  }

  getServer<T extends ServerFactory>(Server: ServerFactoryConstructor<T>): T {
    const server = this.#store.get(`server:${Server.name}`)
    if (server === null || server === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `${Server.name} Server Not Init`)
    }
    return server
  }

  async initPlugin(plugin: Plugin) {
    this.#store.set('plugin', plugin)
    await plugin.initialize()
  }

  getPlugins() {
    const plugin: Plugin = this.#store.get('plugin')
    if (plugin === null || plugin === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Plugin Not Init')
    }
    return plugin
  }

  async initConfig(config: Config) {
    this.#store.set('config', config)
  }

  async initLogger(logger: Logger) {
    this.#store.set('logger', logger)
  }

  get<T>(name: string): T {
    const inst = this.#store.get(name)
    if (inst === null || inst === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `Resources ${name} Not found`)
    }
    return inst
  }

  set<T>(name: string, value: T): this {
    if (this.has(name)) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `Can't Override Resources ${name}`)
    }
    this.#store.set(name, value)
    return this
  }

  getLogger<T extends Logger>(): T {
    const logger = this.#store.get('logger')
    if (logger === null || logger === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Logger Not Init')
    }
    return logger as T
  }

  getConfig(): Config {
    const config = this.#store.get('config')
    if (config === null || config === undefined) {
      throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Config Not Init')
    }
    return config as Config
  }

  getPlugin<T extends AddonPlugin>(addon: AddonPluginConstructor<T>): T {
    return this.plugin.get<T>(addon)
  }

  get log(): Logger {
    return this.getLogger()
  }

  get server(): Server {
    return this._server
  }

  get state(): string {
    return this.#state
  }

  get plugin(): Plugin {
    return this.getPlugins()
  }

  get config(): Config {
    return this.getConfig()
  }

  on(eventName: ZeroantEvent, listener: (...args: any[]) => void): this {
    this.#event.on(eventName, listener)
    return this
  }

  once(eventName: ZeroantEvent, listener: (...args: any[]) => void): this {
    this.#event.once(eventName, listener)
    return this
  }

  off(eventName: ZeroantEvent, listener: (...args: any[]) => void): this {
    this.#event.off(eventName, listener)
    return this
  }

  removeListener(eventName: ZeroantEvent, listener: (...args: any[]) => void): this {
    this.#event.removeListener(eventName, listener)
    return this
  }

  removeAllListeners(eventName: ZeroantEvent): this {
    this.#event.removeAllListeners(eventName)
    return this
  }

  rawListeners(eventName: ZeroantEvent): this {
    this.#event.rawListeners(eventName)
    return this
  }

  emit(eventName: ZeroantEvent, ...args: any[]): boolean {
    return this.#event.emit(eventName, ...args)
  }
}
