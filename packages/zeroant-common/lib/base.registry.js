import RegistryFactory from 'zeroant-factory/registry.factory';
const makeRegistryManager = (registry, type) => {
    class Manager {
        add = (classType) => {
            const classStore = registry[type];
            classStore.push(classType);
            return this;
        };
    }
    return new Manager();
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