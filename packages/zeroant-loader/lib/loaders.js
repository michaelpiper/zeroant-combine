import { logger } from 'zeroant-logger/console';
import { Config } from 'zeroant-config';
import { Plugin } from 'zeroant-factory/plugin.factory';
export const loaders = async (customConfig = {}) => {
    const { zeroant } = await import('./zeroant.js');
    const { registry: _registry, ..._customConfig } = customConfig;
    if (!zeroant.hasRegistry && _registry !== undefined && _registry != null) {
        zeroant.bootstrap(_registry);
    }
    const config = Config.instance.append(_customConfig);
    await Promise.all([zeroant.initLogger(logger), zeroant.initConfig(config)]);
    const registry = zeroant.registry;
    for (const addon of registry.configs) {
        config.addons.set(addon);
    }
    const plugins = new Plugin(zeroant);
    for (const plugin of registry.plugins ?? []) {
        plugins.add(plugin);
    }
    await zeroant.initPlugin(plugins);
    zeroant.initWorkers(registry.workers ?? []);
    for (const AddonServer of registry.servers ?? []) {
        zeroant.initServer(AddonServer, registry);
    }
    zeroant.ready();
    process
        .on('exit', () => {
        zeroant.close();
    })
        .on('SIGINT', () => {
        process.exit();
    })
        .on('SIGTERM', () => {
        process.exit();
    });
    return zeroant;
};
//# sourceMappingURL=loaders.js.map