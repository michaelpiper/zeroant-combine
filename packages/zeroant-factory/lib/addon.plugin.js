export class AddonPlugin {
    context;
    debug;
    constructor(context) {
        this.context = context;
        this.debug = this.context.config.createDebugger(this.name ?? this.constructor.name);
    }
    async initialize() { }
    onStart() { }
    beforeStart() { }
    close() { }
}
//# sourceMappingURL=addon.plugin.js.map