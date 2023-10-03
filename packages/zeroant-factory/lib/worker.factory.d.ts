import { type ZeroantContext } from './zeroant.context.js';
import Queue, { type Job } from 'bull';
import { type ConfigFactory } from './config.factory.js';
import { type RedisOptions } from 'ioredis';
interface WorkerConfigOptions {
    redisUrl: string;
    redisOptions?: RedisOptions;
}
type FnWorkerConfigOptions = (config: ConfigFactory) => WorkerConfigOptions;
export interface WorkerOptions extends Queue.JobOptions {
    concurrency?: number | 10;
    config?: WorkerConfigOptions | FnWorkerConfigOptions;
}
export type WorkerProcessor = (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>) => Promise<void>;
export declare const WorkerConfig: (options?: {
    name: string;
    options?: WorkerOptions | undefined;
} | undefined) => <T extends WorkerFactoryConstructor<WorkerFactory<any, any>>>(target: T) => T;
export type WorkerFactoryConstructor<T extends WorkerFactory<any, any>> = new (context: ZeroantContext<ConfigFactory>) => T;
export interface OnCreate<F = any> {
    onCreate: (processors: Map<F, WorkerProcessor>) => void;
}
export declare abstract class WorkerFactory<T, F extends string> {
    #private;
    readonly context: ZeroantContext<ConfigFactory>;
    static concurrency: number;
    constructor(context: ZeroantContext<ConfigFactory>);
    get options(): WorkerOptions;
    get name(): string;
    get instance(): Queue.Queue<T>;
    abstract processor(job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>): Promise<void>;
    onCreate(processors: Map<F, WorkerProcessor>): void;
    restart(jobId: number): Promise<void>;
    run(concurrency?: number): Promise<void>;
    add(data?: T, options?: Queue.JobOptions): Promise<Job<T>>;
    push(name: F, data?: T, options?: Queue.JobOptions): Promise<Job<T>>;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): Queue.Queue<T>;
    addBulk(bulkData: Array<{
        name?: any;
        data: T;
        opts?: Omit<Queue.JobOptions, 'repeat'> | undefined;
    }>): Promise<Job[]>;
    _wrapper(callback: (job: Queue.Job, done: Queue.DoneCallback, log: (row: string) => Promise<any>) => Promise<void>): (job: Queue.Job, done: Queue.DoneCallback) => Promise<void>;
    getQueue(): Queue.Queue<T>;
}
export {};
