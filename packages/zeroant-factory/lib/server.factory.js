export class ServerFactory {
    context;
    debug;
    constructor(context) {
        this.context = context;
        this.debug = this.context.config.createDebugger(this.name ?? this.constructor.name);
    }
    onStart() { }
    initialize(registry) { }
    beforeStart() { }
    callback() {
        return async (req, res) => { };
    }
    close() { }
}
//# sourceMappingURL=server.factory.js.map