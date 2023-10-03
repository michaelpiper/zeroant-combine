import loaders from 'zeroant-loader/index'
void (async () => {
  const SERVER_MODE = 'standalone'
  const SERVER_APP = 'idp'
  const server = await loaders({
    SERVER_MODE,
    SERVER_APP
  })
  server.listen()
})()
