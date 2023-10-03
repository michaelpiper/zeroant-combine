export default async (type: string | null | undefined) => {
  if ([null, undefined, 'all'].includes(type)) {
    const loaders = await import('../actions/combine.server.js')
    return loaders.default
  }
  if (['cdn', 'idp', 'socket', 'admin', 'worker', 'api'].includes(type as never)) {
    const loaders = await import(`./${type as string}.server.js`)
    return loaders.default
  }
}
