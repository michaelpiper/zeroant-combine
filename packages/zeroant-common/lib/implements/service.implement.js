import { RedisPlugin } from '../plugins/redis.plugin.js';
import { WorkerFactory } from 'zeroant-factory/worker.factory';
import { ErrorCode, ErrorDescription } from '../constants.js';
import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError';
import { PaginationDto } from '../dto/pagination.dto.js';
import { PubSocket } from '../plugins/pubSocket.plugin.js';
import _ from 'lodash';
import { DBPlugin } from '../plugins/db.plugin.js';
export class ServiceImplement {
    repoName;
    Model;
    pk;
    queue;
    state;
    socket;
    constructor(repoName, Model, pk) {
        this.repoName = repoName;
        this.Model = Model;
        this.pk = pk;
    }
    async getRepo() {
        return await import('zeroant-loader/index').then(({ zeroant }) => zeroant.getPlugin(DBPlugin).repository(this.repoName));
    }
    isNumber(value, yes, no) {
        value = Number(value);
        if (Number.isNaN(value)) {
            return no;
        }
        return yes;
    }
    get serializer() {
        return this.Model.fromEntity;
    }
    useQueue(queue) {
        this.queue = queue;
        return this;
    }
    useState(state) {
        this.state = state;
        return this;
    }
    useSocket(socket) {
        this.socket = socket;
        return this;
    }
    get hasSocket() {
        return this.socket instanceof PubSocket;
    }
    get hasState() {
        return this.state instanceof RedisPlugin;
    }
    get hasQueue() {
        return this.queue instanceof WorkerFactory;
    }
    ensureState() {
        if (!this.hasState) {
            throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, 'State has not been initialized, please ensure you call .useState');
        }
    }
    ensureQueue() {
        if (!this.hasQueue) {
            throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, 'Queue has not been initialized, please ensure you call .useQueue');
        }
    }
    ensureSocket() {
        if (!this.hasSocket) {
            throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, 'Socket has not been initialized, please ensure you call .useSocket');
        }
    }
    serializeMany = (entities) => {
        return entities.map((entity) => this.serializer(entity));
    };
    makeFindBy = (key) => async (value, include) => await this.findBy.bind({ serializer: this.serializer, getRepo: async () => await this.getRepo(), include })(key, value);
    makeFindByFields = (pk, ...keys) => async (value, include) => await this.findBy.bind({ serializer: this.serializer, getRepo: async () => await this.getRepo(), include })(pk, value, ...keys);
    async findBy(key, value, ...keys) {
        const repository = (await this.getRepo());
        const entity = await repository.findFirst({
            where: {
                OR: [
                    {
                        [key]: value
                    },
                    ...keys.map((key) => ({ [key]: value }))
                ]
            },
            include: this?.include
        });
        if (entity === null) {
            return null;
        }
        return this.serializer(entity);
    }
    async findByAnd(key, value, ...keys) {
        const repository = (await this.getRepo());
        const entity = await repository.findFirst({
            where: {
                AND: [
                    {
                        [key]: value
                    },
                    ...keys.map((key) => ({ [key]: value }))
                ]
            },
            include: this?.include
        });
        if (entity === null) {
            return null;
        }
        return this.serializer(entity);
    }
    findByPk = async (value, include) => await this.findBy.bind({ serializer: this.serializer, getRepo: async () => await this.getRepo(), include })(this.pk, value);
    list = async (pagination) => {
        pagination = pagination ?? new PaginationDto().setPage(1).setLimit(50);
        const query = {
            skip: pagination.getSkip(),
            take: pagination.getLimit(),
            include: pagination.getRelations(),
            orderBy: pagination.getSort(),
            where: pagination.getFilter()
        };
        const repository = (await this.getRepo());
        const [count, entities] = await Promise.all([repository.count(_.pick(query, ['where'])), repository.findMany(query)]);
        return pagination.setCount(count).buildResult(this.serializeMany(entities));
    };
    static _from(zeroant, Service, workerClass) {
        const redis = zeroant.getPlugin(RedisPlugin);
        const worker = workerClass !== undefined ? zeroant.getWorker(workerClass) : undefined;
        const socket = zeroant.getPlugin(PubSocket);
        return new Service().useSocket(socket).useQueue(worker).useState(redis);
    }
    findByIdOrRef = async (id, userRef, include) => {
        if (typeof userRef === 'string') {
            return await this.#findByIdOrRefWithUser(id, userRef, include);
        }
        return await this.#findByIdOrRefWithoutUser(id);
    };
    #findByIdOrRefWithUser = async (id, userRef, include = { user: true }) => {
        const repository = (await this.getRepo());
        const orderId = Number(id);
        const where = [];
        if (Number.isNaN(orderId)) {
            where.push({
                user_ref: userRef,
                [`${this.repoName}_ref`]: id
            });
        }
        else {
            where.push({
                user_ref: userRef,
                [`${this.repoName}_id`]: orderId
            });
        }
        const result = await repository.findFirst({
            where: {
                OR: where
            },
            include: include
        });
        if (result === null) {
            return null;
        }
        return this.serializer(result);
    };
    #findByIdOrRefWithoutUser = async (id, include = {}) => {
        const repository = (await this.getRepo());
        const where = [];
        const orderId = Number(id);
        if (Number.isNaN(orderId)) {
            where.push({
                [`${this.repoName}_ref`]: id
            });
        }
        else {
            where.push({
                [`${this.repoName}_id`]: orderId
            });
        }
        const result = await repository.findFirst({
            where: {
                OR: where
            },
            include: include
        });
        if (result === null) {
            return null;
        }
        return this.serializer(result);
    };
}
//# sourceMappingURL=service.implement.js.map