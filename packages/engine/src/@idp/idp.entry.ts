import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-router'
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory'
export default class IdpRouteEntry extends RegistryRouteEntryFactory {
  public router: Router = new Router({
    prefix: '/idp'
  })

  public name = 'idp'
  buildRoutes() {
    this.router.use(bodyParser({ jsonLimit: '1mb' }))
    this.router.use(cors())
  }
}
