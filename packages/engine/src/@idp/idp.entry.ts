import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-router'
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory'
export default class IdpRouteEntry extends RegistryRouteEntryFactory {
  public router: Router = new Router({
    prefix: '/idp'
  })

  public name = 'idp'
  public options: {
    body?: bodyParser.Options,
    cors?: cors.Options
  } = {
    body: {
      jsonLimit: '1mb'
    }
  }
  buildRoutes() {
    this.router.use(bodyParser(this.options.body))
    this.router.use(cors(this.options.cors))
  }
}
