import loaders from 'zeroant-loader';
export default async () => {
    const SERVER_MODE = 'combine';
    const SERVER_APP = '*';
    const server = await loaders({
        SERVER_MODE,
        SERVER_APP
    });
    server.listen();
};
//# sourceMappingURL=combine.server.js.map