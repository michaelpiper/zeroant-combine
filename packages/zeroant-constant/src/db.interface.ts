export interface Datasource {
  url?: string
}
export interface Datasources {
  db?: Datasource
}
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

export interface DBClientOptions {
  /**
   * Overwrites the datasource url from your schema.prisma file
   */
  datasources?: Datasources

  /**
   * Overwrites the datasource url from your schema.prisma file
   */
  datasourceUrl?: string

  /**
   * @default "colorless"
   */
  errorFormat?: ErrorFormat

  /**
   * @example
   * ```
   * // Defaults to stdout
   * log: ['query', 'info', 'warn', 'error']
   *
   * // Emit as events
   * log: [
   *  { emit: 'stdout', level: 'query' },
   *  { emit: 'stdout', level: 'info' },
   *  { emit: 'stdout', level: 'warn' }
   *  { emit: 'stdout', level: 'error' }
   * ]
   * ```
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
   */
  log?: Array<LogLevel | LogDefinition>
}

/* Types for Logging */
export type LogLevel = 'info' | 'query' | 'warn' | 'error'
export interface LogDefinition {
  level: LogLevel
  emit: 'stdout' | 'event'
}
