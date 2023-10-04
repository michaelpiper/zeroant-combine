import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import responseHandler from 'zeroant-response/response.handler'
import errorHandler from 'zeroant-response/error.handler'
import Router from 'koa-router'
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory'
export default class ApiRouteEntry extends RegistryRouteEntryFactory {
  public router: Router = new Router({
    prefix: '/api'
  })

  public name = 'api'
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
    this.router.use(errorHandler())
    this.router.use(responseHandler())
  }
}
