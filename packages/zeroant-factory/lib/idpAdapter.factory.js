export default class IdpAdapterFactory {
    name;
    constructor(name) {
        this.name = name;
    }
    async upsert(id, payload, expiresIn = 0) { }
    async find(id) { }
    async findByUserCode(userCode) { }
    async findByUid(uid) { }
    async consume(id) { }
    async destroy(id) { }
    async revokeByGrantId(grantId) { }
}
//# sourceMappingURL=idpAdapter.factory.js.map