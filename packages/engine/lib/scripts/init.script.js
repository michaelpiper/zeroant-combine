const init = async () => {
    const { zeroant } = await import('zeroant-loader/zeroant');
    zeroant.log.info('Init in', { path: zeroant.config.appPath });
};
export default init;
//# sourceMappingURL=init.script.js.map