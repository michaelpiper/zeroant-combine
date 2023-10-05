import RegistryFactory from 'zeroant-factory/registry.factory';
class Manager {
    store;
    constructor(store) {
        this.store = store;
    }
    add = (classType) => {
        this.store.push(classType);
        return this;
    };
}
const makeRegistryManager = (registry, type) => {
    return new Manager(registry[type]);
};
export class BaseRegistry extends RegistryFactory {
    configs = [];
    plugins = [];
    servers = [];
    middlewares = [];
    routes = [];
    workers = [];
    get worker() {
        return makeRegistryManager(this, 'workers');
    }
    get config() {
        return makeRegistryManager(this, 'configs');
    }
    get middleware() {
        return makeRegistryManager(this, 'middlewares');
    }
    get plugin() {
        return makeRegistryManager(this, 'plugins');
    }
    get route() {
        return makeRegistryManager(this, 'routes');
    }
    get server() {
        return makeRegistryManager(this, 'servers');
    }
}
//# sourceMappingURL=base.registry.js.map