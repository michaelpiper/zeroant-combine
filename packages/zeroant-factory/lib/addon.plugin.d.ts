import { type ZeroantContext } from './zeroant.context.js';
import { type ConfigFactory } from './config.factory.js';
export type AddonPluginConstructor<T extends AddonPlugin> = new (context: ZeroantContext<ConfigFactory>) => T;
export type AddonPluginFactory = AddonPluginConstructor<AddonPlugin>;
export declare abstract class AddonPlugin {
    protected readonly context: ZeroantContext<ConfigFactory>;
    debug: import("./config.factory.js").IDebugger;
    constructor(context: ZeroantContext<ConfigFactory>);
    initialize(): Promise<void>;
    onStart(): void;
    beforeStart(): void;
    close(): void;
}
