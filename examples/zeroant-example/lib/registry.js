import { AdminConfig } from 'zeroant-common/config/admin.config';
import { CDNConfig } from 'zeroant-common/config/cdn.config';
import { DBConfig } from 'zeroant-common/config/db.config';
import { PubSocketConfig } from 'zeroant-common/config/pubSocket.config';
import { RedisConfig } from 'zeroant-common/config/redis.config';
import { CacheManagerPlugin } from 'zeroant-common/plugins/cacheManger.plugin';
import { DBPlugin } from 'zeroant-common/plugins/db.plugin';
import { PubSocket } from 'zeroant-common/plugins/pubSocket.plugin';
import { RedisPlugin } from 'zeroant-common/plugins/redis.plugin';
import { HttpServer } from 'zeroant-common/servers/http.server';
import { SocketServer } from 'zeroant-common/servers/socket.server';
import { Registry } from 'zeroant/registry';
import AdminEntry from 'zeroant/@admin/admin.entry';
export const registry = new Registry();
registry.config.add(RedisConfig).add(DBConfig).add(AdminConfig).add(PubSocketConfig).add(CDNConfig);
registry.plugin.add(RedisPlugin).add(DBPlugin).add(CacheManagerPlugin).add(PubSocket);
registry.server.add(HttpServer).add(SocketServer);
registry.route.add(AdminEntry);
//# sourceMappingURL=registry.js.map