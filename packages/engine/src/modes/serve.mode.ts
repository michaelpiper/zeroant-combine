import getMode from './get-mode.js'
const serve = async (type: string | null | undefined, ...args: any[]) => {
  const mode = await getMode(type)
  if (mode == null) {
    console.log('Unknown server type')
    return
  }
  mode(...args)
}

export default serve
