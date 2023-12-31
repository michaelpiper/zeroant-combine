import loaders from 'zeroant-loader';
export default async () => {
    const SERVER_MODE = 'standalone';
    const SERVER_APP = '';
    const server = await loaders({
        SERVER_MODE,
        SERVER_APP,
        ENABLE_HTTP: 'false',
        ENABLE_SOCKET: 'true',
        USE_PUB_SOCKET: 'false'
    });
    server.listen();
};
//# sourceMappingURL=socket.server.js.map