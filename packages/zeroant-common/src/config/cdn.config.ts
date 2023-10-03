import { AddonConfig } from 'zeroant-factory/addon.config'

export class CDNConfig extends AddonConfig {
  get url() {
    return this.config.get<string>('CDN_BASE_URL')
  }
}
