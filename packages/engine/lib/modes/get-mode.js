export default async (type) => {
    if ([null, undefined, 'all'].includes(type)) {
        const loaders = await import('../actions/combine.server.js');
        return loaders.default;
    }
    if (['cdn', 'idp', 'socket', 'admin', 'worker', 'api'].includes(type)) {
        const loaders = await import(`./${type}.server.js`);
        return loaders.default;
    }
};
//# sourceMappingURL=get-mode.js.map