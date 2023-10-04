export const availableType = ['cdn', 'idp', 'socket', 'admin', 'worker', 'api']
export const defaultType = [null, undefined, 'all']
const getMode = async (type: string | null | undefined) => {
  if (defaultType.includes(type)) {
    const loaders = await import('../actions/combine.server.js')
    return loaders.default
  }
  if (availableType.includes(type as never)) {
    const loaders = await import(`../actions/${type as string}.server.js`)
    return loaders.default
  }
}
export default  getMode
