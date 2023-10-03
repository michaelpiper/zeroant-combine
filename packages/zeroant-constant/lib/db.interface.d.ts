export interface Datasource {
    url?: string;
}
export interface Datasources {
    db?: Datasource;
}
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface DBClientOptions {
    datasources?: Datasources;
    datasourceUrl?: string;
    errorFormat?: ErrorFormat;
    log?: Array<LogLevel | LogDefinition>;
}
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export interface LogDefinition {
    level: LogLevel;
    emit: 'stdout' | 'event';
}
