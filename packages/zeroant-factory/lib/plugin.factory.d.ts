import { type ZeroantContext } from './zeroant.context.js';
import { type AddonPluginConstructor, type AddonPlugin } from './addon.plugin.js';
import { type ConfigFactory } from './config.factory.js';
export declare class Plugin {
    private readonly context;
    private readonly _addons;
    constructor(context: ZeroantContext<ConfigFactory>);
    values(): IterableIterator<AddonPlugin>;
    get<T extends AddonPlugin>(Type: AddonPluginConstructor<T>): T;
    add(Addon: AddonPluginConstructor<AddonPlugin>): this;
    initialize(): Promise<void>;
}
