import loaders from 'zeroant-loader/index';
void (async () => {
    const SERVER_MODE = 'standalone';
    const SERVER_APP = 'cdn';
    const server = await loaders({
        SERVER_MODE,
        SERVER_APP
    });
    server.listen();
})();
//# sourceMappingURL=cdn.server.js.map