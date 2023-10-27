import { type DBClientOptions } from 'zeroant-constant'
import { AddonConfig } from 'zeroant-factory/addon.config'

export type DBOptions = DBClientOptions
export class DBConfig extends AddonConfig {
  get development(): DBOptions {
    return {
      // type: this.config.get<any>('DB_ENGINE', 'sqlite'),
      // url: this.config.get<any>('DB_URL', null) ?? undefined,
      // host: this.config.get('DB_HOST', null) ?? undefined,
      // port: this.config.get('DB_PORT', null) ?? undefined,
      // username: this.config.get('DB_USERNAME', null) ?? undefined,
      // password: this.config.get('DB_PASSWORD', null) ?? undefined,
      // database: this.config.get('DB_DATABASE', this.config.absPath + '/db.sqlite'),
      // replicaSet: this.config.get('DB_HOST_REPLICA', null) ?? undefined,
      // synchronize: false,
      // entities: ['**/*.entity.js'],
      // migrations: ['**/migrations/*.js']
    }
  }

  get production(): DBOptions {
    return {
      // type: this.config.get<any>('PROD_DB_ENGINE', 'sqlite'),
      // url: this.config.get<any>('DB_URL', null) ?? undefined,
      // host: this.config.get('PROD_DB_HOST', null) ?? undefined,
      // port: this.config.get('PROD_DB_PORT', null) ?? undefined,
      // username: this.config.get('PROD_DB_USERNAME', null) ?? undefined,
      // password: this.config.get('PROD_DB_PASSWORD', null) ?? undefined,
      // database: this.config.get('PROD_DB_DATABASE', this.config.absPath + '/db.sqlite'),
      // replicaSet: this.config.get('DB_HOST_REPLICA', null) ?? undefined,
      // synchronize: false,
      // entities: ['**/*.entity.js'],
      // migrations: ['**/migrations/*.js']
    }
  }

  get test(): DBOptions {
    return {
      // type: this.config.get<any>('TEST_DB_ENGINE', 'sqlite'),
      // url: this.config.get<any>('DB_URL', null) ?? undefined,
      // host: this.config.get('TEST_DB_HOST', null) ?? undefined,
      // port: this.config.get('TEST_DB_PORT', null) ?? undefined,
      // username: this.config.get('TEST_DB_USERNAME', null) ?? undefined,
      // password: this.config.get('TEST_DB_PASSWORD', null) ?? undefined,
      // database: this.config.get('TEST_DB_DATABASE', this.config.absPath + '/db.sqlite'),
      // replicaSet: this.config.get('DB_HOST_REPLICA', null) ?? undefined,
      // synchronize: false,
      // entities: ['**/*.entity.js'],
      // migrations: ['**/migrations/*.js']
    }
  }

  get options(): DBOptions {
    if (this.config.isProd) {
      return this.production
    }
    switch (this.config.environment) {
      case 'production':
        return this.production
      case 'test':
        return this.test
      default:
        return this.development
    }
  }
}
