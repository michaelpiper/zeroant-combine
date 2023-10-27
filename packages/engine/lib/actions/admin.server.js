import loaders from 'zeroant-loader';
export default async () => {
    const SERVER_MODE = 'standalone';
    const SERVER_APP = 'admin';
    const server = await loaders({
        SERVER_MODE,
        SERVER_APP
    });
    server.listen();
};
//# sourceMappingURL=admin.server.js.map