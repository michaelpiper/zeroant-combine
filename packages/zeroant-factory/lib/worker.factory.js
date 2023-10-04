import Queue from 'bull';
export const WorkerConfig = (options) => {
    return function (target) {
        if (options?.name !== undefined) {
            Object.defineProperty(target, 'name', {
                value: options?.name,
                configurable: false,
                writable: false
            });
        }
        Object.defineProperty(target, 'options', {
            value: options?.options ?? {
                delay: 0,
                removeOnComplete: true,
                concurrency: WorkerFactory.concurrency
            },
            configurable: false,
            writable: false
        });
        return target;
    };
};
export class WorkerFactory {
    context;
    static concurrency = 10;
    #queue;
    #processors = new Map();
    constructor(context) {
        this.context = context;
        switch (typeof this.options.config) {
            case 'function': {
                const config = this.options.config(this.context.config);
                this.#queue = new Queue(this.name, config.redisUrl, {
                    redis: config?.redisOptions ?? {},
                    defaultJobOptions: this.options ?? {}
                });
                break;
            }
            case 'object': {
                const config = this.options.config;
                this.#queue = new Queue(this.name, config.redisUrl, {
                    redis: config?.redisOptions ?? {},
                    defaultJobOptions: this.options ?? {}
                });
                break;
            }
            default: {
                if (process.env.REDIS_URI !== undefined) {
                    this.#queue = new Queue(this.name, process.env.REDIS_URI, {
                        redis: {},
                        defaultJobOptions: this.options ?? {}
                    });
                    break;
                }
                this.#queue = new Queue(this.name, {
                    defaultJobOptions: this.options ?? {}
                });
            }
        }
        this.onCreate(this.#processors);
    }
    get options() {
        return this.constructor.options;
    }
    get name() {
        return this.constructor.name;
    }
    get instance() {
        return this.#queue;
    }
    onCreate(processors) { }
    async restart(jobId) {
        const job = await this.#queue.getJob(jobId);
        if (job === null) {
            return;
        }
        await job.retry();
    }
    async run(concurrency) {
        console.log(`${this.name} default worker started successfully ${new Date().toLocaleString()}`);
        const wrapper = this._wrapper(async (job, done, log) => {
            await this.processor(job, done, log);
        });
        await Promise.all([
            ...Array.from(this.#processors.entries()).map(async ([name, processor]) => {
                console.log(`${this.name} ${name} worker started successfully ${new Date().toLocaleString()}`);
                const wrapper = this._wrapper(async (job, done, log) => {
                    await processor(job, done, log);
                });
                await this.#queue.process(name, concurrency ?? this.options.concurrency ?? WorkerFactory.concurrency, wrapper);
            })
        ]);
        await this.#queue.process(concurrency ?? this.options.concurrency ?? WorkerFactory.concurrency, wrapper);
    }
    async add(data, options) {
        console.log('pushing to queue', this.name);
        return await this.#queue.add(data, options);
    }
    async push(name, data, options) {
        console.log('pushing to queue', this.name, name);
        return await this.#queue.add(name, data, options ?? {});
    }
    addListener(eventName, listener) {
        return this.#queue.addListener(eventName, listener);
    }
    async addBulk(bulkData) {
        return await this.#queue.addBulk(bulkData);
    }
    _wrapper(callback) {
        return async (job, done) => {
            const start = Date.now();
            const { id, name } = job;
            const data = job.data;
            const log = job.log.bind(job);
            console.log('[-------------------------------------------]');
            console.log(`Processing ${this.name}->${name} Job: ${id} `);
            console.log(`${this.name}->${name} Worker Processor data ----->`, JSON.stringify(data));
            try {
                await callback(job, done, log);
            }
            catch (caught) {
                console.log(`${this.name}->${name} Worker Error -----> `, caught);
                await log(caught.message);
                done(caught);
            }
            console.log(`Job ${this.name}->${name} ${id} ran for ${(Date.now() - start) / 1000}s`);
            console.log('[-------------------------------------------]');
        };
    }
    getQueue() {
        return this.#queue;
    }
}
//# sourceMappingURL=worker.factory.js.map