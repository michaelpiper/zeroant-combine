export class InternalBootstrap {
    #debug;
    $internalLifecycle(context) {
        this.#debug = context.config.createDebugger(this.constructor.name);
    }
    get debug() {
        return this.#debug;
    }
}
export class RegistryRouteEntryFactory extends InternalBootstrap {
    context;
    constructor(context) {
        super();
        this.context = context;
        this.$internalLifecycle(context);
    }
    name;
    buildRoutes() { }
}
export default class RegistryFactory {
    bootstrap(context) { }
    ready(context) { }
}
//# sourceMappingURL=registry.factory.js.map