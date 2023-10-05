import { type Middleware, type DefaultState, type DefaultContext } from 'koa'

import { type AddonConfigFactory } from 'zeroant-factory/addon.config'
import { type AddonPluginFactory } from 'zeroant-factory/addon.plugin'
import RegistryFactory, { type RegistryRouteEntryConstructor, type RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory'
import { type ServerFactoryConstructor, type ServerFactory } from 'zeroant-factory/server.factory'
import { type WorkerFactoryConstructor, type WorkerFactory } from 'zeroant-factory/worker.factory'
class Manager<T> {
  constructor(public store: T[]) {}
  add = (classType: T): this => {
    this.store.push(classType)
    return this
  }
}
const makeRegistryManager = <
  A extends keyof R,
  R = {
    workers: WorkerFactoryConstructor<WorkerFactory<any, any>>
    routes: RegistryRouteEntryConstructor<RegistryRouteEntryFactory>
    middlewares: Middleware<DefaultState, DefaultContext, any>
    servers: ServerFactoryConstructor<ServerFactory>
    plugins: AddonPluginFactory
    configs: AddonConfigFactory
  }
>(
  registry: RegistryFactory,
  type: A
) => {
  return new Manager<R[A]>(registry[type] as any as Array<R[A]>)
}
export class BaseRegistry extends RegistryFactory {
  configs: AddonConfigFactory[] = []
  plugins: AddonPluginFactory[] = []
  servers: Array<ServerFactoryConstructor<ServerFactory>> = []
  middlewares: Array<Middleware<DefaultState, DefaultContext, any>> = []
  routes: Array<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>> = []
  workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>> = []
  get worker() {
    return makeRegistryManager(this, 'workers')
  }

  get config() {
    return makeRegistryManager(this, 'configs')
  }

  get middleware() {
    return makeRegistryManager(this, 'middlewares')
  }

  get plugin() {
    return makeRegistryManager(this, 'plugins')
  }

  get route() {
    return makeRegistryManager(this, 'routes')
  }

  get server() {
    return makeRegistryManager(this, 'servers')
  }
}
