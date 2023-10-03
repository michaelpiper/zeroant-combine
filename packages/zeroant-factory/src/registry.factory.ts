import type Router from 'koa-router'
import type Koa from 'koa'
import { type ZeroantContext } from './zeroant.context.js'
import { type AddonConfigFactory } from './addon.config.js'
import { type AddonPluginFactory } from './addon.plugin.js'
import { type ServerFactory, type ServerFactoryConstructor } from './server.factory.js'
import { type WorkerFactory, type WorkerFactoryConstructor } from './worker.factory.js'
import { type IDebugger, type ConfigFactory } from './config.factory.js'
export abstract class InternalBootstrap {
  #debug: IDebugger
  $internalLifecycle(context: ZeroantContext<ConfigFactory>) {
    this.#debug = context.config.createDebugger(this.constructor.name)
  }

  get debug() {
    return this.#debug
  }
}
export type RegistryRouteEntryConstructor<T extends RegistryRouteEntryFactory> = new (context: ZeroantContext<ConfigFactory>) => T
export abstract class RegistryRouteEntryFactory extends InternalBootstrap {
  constructor(protected readonly context: ZeroantContext<ConfigFactory>) {
    super()
    this.$internalLifecycle(context)
  }

  name: string
  abstract router: Router | Koa

  buildRoutes() {}
}

export default abstract class RegistryFactory {
  bootstrap(context: ZeroantContext<ConfigFactory>) {}

  ready(context: ZeroantContext<ConfigFactory>) {}

  abstract readonly configs: AddonConfigFactory[]
  abstract readonly plugins: AddonPluginFactory[]
  abstract readonly servers: Array<ServerFactoryConstructor<ServerFactory>>
  abstract readonly middlewares: Koa.Middleware[]
  abstract readonly routes: Array<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>>
  abstract readonly workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>
}
