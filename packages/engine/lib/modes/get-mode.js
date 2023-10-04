export const availableType = ['cdn', 'idp', 'socket', 'admin', 'worker', 'api'];
export const defaultType = [null, undefined, 'all'];
const getMode = async (type) => {
    if (defaultType.includes(type)) {
        const loaders = await import('../actions/combine.server.js');
        return loaders.default;
    }
    if (availableType.includes(type)) {
        const loaders = await import(`../actions/${type}.server.js`);
        return loaders.default;
    }
};
export default getMode;
//# sourceMappingURL=get-mode.js.map