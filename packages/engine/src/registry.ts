// import { AdminConfig } from 'zeroant-common/config/admin.config'
// import { CDNConfig } from 'zeroant-common/config/cdn.config'
// import { DBConfig } from 'zeroant-common/config/db.config'
// import { PubSocketConfig } from 'zeroant-common/config/pubSocket.config'
// import { RedisConfig } from 'zeroant-common/config/redis.config'
import { BaseRegistry } from 'zeroant-common/base.registry'
import { ZeroantEvent } from 'zeroant-constant/zeroant.enum'
import { type ConfigFactory } from 'zeroant-factory/config.factory'
import { type ZeroantContext } from 'zeroant-factory/zeroant.context'
// import { CacheManagerPlugin } from 'zeroant-common/plugins/cacheManger.plugin'
// import { DBPlugin } from 'zeroant-common/plugins/db.plugin'
// import { PubSocket } from 'zeroant-common/plugins/pubSocket.plugin'
// import { RedisPlugin } from 'zeroant-common/plugins/redis.plugin'
// import { HttpServer } from 'zeroant-common/servers/http.server'
// import { SocketServer } from 'zeroant-common/servers/socket.server'
import zeroant from 'zeroant-loader/zeroant'
// import AdminEntry from './@admin/admin.entry.js'

export class Registry extends BaseRegistry {
  onBootstrap(callback: (context: ZeroantContext<ConfigFactory>) => void) {
    zeroant.on(ZeroantEvent.BOOTSTRAP, callback)
  }

  onReady(callback: (context: ZeroantContext<ConfigFactory>) => void) {
    zeroant.on(ZeroantEvent.READY, callback)
  }
}
