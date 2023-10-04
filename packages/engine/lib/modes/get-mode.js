export const availableType = ['cdn', 'idp', 'socket', 'admin', 'worker', 'api'];
export const defaultType = [null, undefined, 'all'];
export default async (type) => {
    if (defaultType.includes(type)) {
        const loaders = await import('../actions/combine.server.js');
        return loaders.default;
    }
    if (availableType.includes(type)) {
        const loaders = await import(`../actions/${type}.server.js`);
        return loaders.default;
    }
};
//# sourceMappingURL=get-mode.js.map