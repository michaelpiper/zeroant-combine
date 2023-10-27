import { type SERVER_MODE } from 'zeroant-factory/config.factory'
import loaders from 'zeroant-loader'
export default async () => {
  const SERVER_MODE: SERVER_MODE = 'combine'
  const SERVER_APP = '*'
  const server = await loaders({
    SERVER_MODE,
    SERVER_APP
  })
  server.listen()
}
