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
    process.on('exit', () => {
        zeroant.close();
    });
    process.on('beforeExit', () => {
        zeroant.safeExit(0, 'beforeExit');
    });
    process
        .on('SIGINT', () => {
        zeroant.safeExit(0, 'SIGINT');
    })
        .on('SIGQUIT', () => {
        zeroant.safeExit(1, 'SIGQUIT');
    })
        .on('SIGTERM', () => {
        zeroant.safeExit(1, 'SIGTERM');
    })
        .on('SIGHUP', () => {
        zeroant.safeExit(1, 'SIGHUP');
    })
        .on('SIGBREAK', () => {
        zeroant.safeExit(1, 'SIGBREAK');
    })
        .on('uncaughtException', (err) => {
        console.trace(err);
        zeroant.safeExit(1, 'uncaughtException');
    });
    return zeroant;
};
//# sourceMappingURL=loaders.js.map