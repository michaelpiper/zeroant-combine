import { SocketEvent, WebSocketCloseCode } from 'zeroant-constant/socket.enum'
import { ServerFactory } from 'zeroant-factory/server.factory'
import { RedisPlugin } from '../plugins/redis.plugin.js'
import { type ZeroantContext } from 'zeroant-factory/zeroant.context'
import { WebSocketServer, type WebSocket } from 'ws'
import * as uuid from 'uuid'
import { type IncomingMessage } from 'http'
import { PubSocketConfig } from '../config/pubSocket.config.js'
import { PubSocketPayload, SubSocketPayload } from '../dto/socket.payload.js'
import { type ConfigFactory } from 'zeroant-factory/config.factory'
import { ZeroantEvent } from '../constants.js'
declare module 'ws' {
  interface WebSocket {
    sub: string
    uuid: string
    topics: string[]
    sendPayload: (payload: Record<string, any>) => void
    sendResPayload: (topic: string, code: number, payload: Record<string, any>) => void
  }
}
export class SocketServer<PubSocketTopic extends string, SubSocketTopic extends string> extends ServerFactory {
  private _io!: WebSocketServer
  private readonly _redis
  constructor(context: ZeroantContext<ConfigFactory>) {
    super(context)
    this._redis = context.getPlugin(RedisPlugin).instance
  }

  get enabled() {
    return this.context.config.enableSocket
  }

  initialize() {
    if (!this.enabled) {
      return
    }
    this.debug('info', 'Enabled')
  }

  onStart() {
    if (!this.enabled) {
      return
    }
    const serverInstance = this.context.server
    this._io = new WebSocketServer({
      server: serverInstance
      // backlog: 0,
    })
    this.listen()
  }

  subscribe(payload: PubSocketPayload<PubSocketTopic, any>, identifier: 'sub' | 'uuid' = 'sub') {
    const service = {
      send: () => {
        if (payload.sub !== null && payload.topic !== null) {
          this.to(payload.sub, identifier).send(payload.topic as never, payload.payload)
        } else if (payload.topic !== null) {
          for (const client of this._io.clients.values() as any as WebSocket[]) {
            if (client.topics.includes(payload.topic) || client.topics.includes('*')) {
              client.sendPayload({ topic: payload.topic, payload: payload.payload })
            }
          }
        }
      },
      subscribe: () => {
        if (!(payload.sub !== null && payload.topic !== null)) {
          return
        }
        for (const client of this._io.clients.values() as any as WebSocket[]) {
          if (client[identifier] !== payload.sub) {
            continue
          }
          if (client.topics.includes(payload.topic)) {
            client.sendResPayload(payload.topic, 0, {
              message: `Already subscribed to topic ${payload.topic} `
            })
          } else {
            client.topics.push(payload.topic)
            client.sendResPayload(payload.topic, 0, {
              message: `Subscribed to topic ${payload.topic} `
            })
          }
        }
      },
      unsubscribe: () => {
        if (!(payload.sub !== null && payload.topic !== null)) {
          return
        }
        for (const client of this._io.clients.values() as any as WebSocket[]) {
          if (client[identifier] !== payload.sub) {
            continue
          }
          if (client.topics.includes(payload.topic)) {
            client.topics = client.topics.filter((topic) => topic !== payload.topic)
            client.sendResPayload(payload.topic, 0, {
              message: `Unsubscribed to topic ${payload.topic} `
            })
          } else {
            client.sendResPayload(payload.topic, 0, {
              message: `Already unsubscribed to topic ${payload.topic} `
            })
          }
        }
      }
    }
    return service
  }

  to(sub: string, identifier: 'sub' | 'uuid' = 'sub') {
    const clients = [] as WebSocket[]
    if (this.enabled) {
      for (const client of this._io.clients.values() as any as WebSocket[]) {
        if (client[identifier] === sub) {
          clients.push(client)
        }
      }
    }
    return {
      clients,
      send: (topic: string, payload: Record<string, any>) => {
        for (const client of clients) {
          client.sendPayload({ topic, payload })
        }
      },
      close: (code?: number | undefined, data?: string | Buffer | undefined) => {
        for (const client of clients) {
          client.close(code, data)
          this._io.clients.delete(client)
        }
      }
    }
  }

  decodeAuth({ authorization }: any = {}) {
    if (authorization === undefined || authorization === null) {
      return []
    }
    const [type, encoded = ''] = authorization.split(' ')
    if (type !== 'Basic') {
      return []
    }

    const [username = '', password = null] = Buffer.from(encoded, 'base64').toString('utf-8').split(':')
    if (password === null) {
      // username field becomes the password
      return [undefined, username]
    }
    return [username, password]
  }

  applyHelper(client: WebSocket) {
    client.sendPayload = (payload: Record<string, any>) => {
      const data = Buffer.from(JSON.stringify(payload))
      client.send(data)
    }
    client.sendResPayload = (topic: string, code: number, payload: Record<string, any>) => {
      client.sendPayload({
        topic: topic + '_RES',
        code,
        payload
      })
    }
    if (!Array.isArray(client.topics)) {
      client.topics = []
    }
    if (typeof client.uuid !== 'string') {
      client.uuid = uuid.v4()
    }
  }

  listen() {
    this._io
      .on(SocketEvent.CONNECTION, (socket: WebSocket, message: IncomingMessage) => {
        this.applyHelper(socket)
        // token format verification
        const url = message.url
        const [protocol = 'sub', password] = this.decodeAuth(message.headers)
        this.debug('info', 'New Connection', message.headers, { protocol, password }, url)

        if (protocol === 'pub') {
          void this.onPub(socket, message, password).catch((e) => {
            this.debug('error', 'ON PUB', e.message)
          })
        } else {
          void this.onSub(socket, message, password).catch((e) => {
            this.debug('error', 'ON SUB', e.message)
          })
        }

        // socket.on('ping', (data) => {
        //   this.debug('info', 'ping', socket.uuid, data)
        // })
      })
      .on('close', () => {
        this._close(WebSocketCloseCode.CLOSE_ABNORMAL, 'server restart')
        this.debug('info', 'Is disconnected')
      })
    this.debug('info', 'Is listening')
  }

  async onPub(socket: WebSocket, message: IncomingMessage, password?: string) {
    if (password === null || password === undefined || !this.context.config.addons.get(PubSocketConfig).pubKey.includes(password)) {
      this.debug('error', this.context.config.addons.get(PubSocketConfig).pubKey.join(' '), password)
      socket.close(WebSocketCloseCode.CLOSE_NORMAL, 'Unauthorized passkey')
      return
    }
    socket.on('ping', (data) => {
      console.log('PubSocket ping request', data)
    })
    //  remove sub from redis once disconnect
    socket.on(SocketEvent.MESSAGE, (data: any, isBinary) => {
      if (data instanceof Buffer) {
        const payload = PubSocketPayload.fromBuffer(data)
        // this.debug('info', 'Pub New Event', payload)
        // this.subscribe(payload).send()
        this.pubEvents(socket, payload)
      } else {
        const payload = new PubSocketPayload('RAW' as never, data)
        this.pubEvents(socket, payload)
      }
    })
  }

  async onSub(socket: WebSocket, message: IncomingMessage, password?: string) {
    if (password !== null && password !== undefined) {
      const [realm, token] = password.split(' ', 2)
      const payload = new SubSocketPayload<SubSocketTopic, any>('CONNECTION_UPGRADE' as never, { token, realm })
      this.subEvents(socket, payload)
    }
    socket.on('ping', (data) => {
      console.log('ClientSocket ping request from client', data)
    })
    //  remove sub from redis once disconnect
    socket.on(SocketEvent.MESSAGE, (data: any, isBinary) => {
      if (data instanceof Buffer) {
        const payload = SubSocketPayload.fromBuffer(data)
        this.subEvents(socket, payload)
      } else {
        const payload = new SubSocketPayload('RAW' as never, data)
        this.subEvents(socket, payload)
      }
    })
  }

  subEvents(client: WebSocket, payload: SubSocketPayload<SubSocketTopic, any>) {
    this.debug('info', 'SUB New Event', payload)
    this.context.emit(ZeroantEvent.SUB_SOCKET, client, payload)
  }

  pubEvents(client: WebSocket, payload: PubSocketPayload<SubSocketTopic, any>) {
    this.debug('info', 'PUB New Event', payload)
    this.context.emit(ZeroantEvent.PUB_SOCKET, client, payload)
  }

  close(): void {
    if (!this.enabled) {
      return
    }
    this._close()
    this._io?.close()
    this.debug('info', 'Stopped')
  }

  _close(code: WebSocketCloseCode = WebSocketCloseCode.SERVICE_RESTART, message: any = 'Server Restarting') {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this._io) {
      return
    }
    for (const client of this._io.clients.values() as IterableIterator<WebSocket>) {
      client.close(code, message)
    }
  }

  get instance(): WebSocketServer {
    return this._io
  }
}
