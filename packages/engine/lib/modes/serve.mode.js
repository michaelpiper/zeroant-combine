import getMode from './get-mode.js';
export default async (type) => {
    const mode = await getMode(type);
    if (mode == null) {
        console.log('Unknown server type');
        return;
    }
    mode();
};
//# sourceMappingURL=serve.mode.js.map